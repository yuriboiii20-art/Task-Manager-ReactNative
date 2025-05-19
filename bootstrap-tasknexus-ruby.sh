#!/usr/bin/env bash
set -e

# 1) Clean and create ruby/ structure
rm -rf ruby
mkdir -p ruby/{app/models,app/controllers,config,initializers,public}

# 2) Gemfile
cat > ruby/Gemfile << 'EOF'
source 'https://rubygems.org'
ruby '3.1.0'

gem 'sinatra',      require: 'sinatra/base'
gem 'mongoid',      '~> 7.3'
gem 'jwt'
gem 'bcrypt'
gem 'rack-cors'
gem 'json'
EOF

# 3) config/mongoid.yml
cat > ruby/config/mongoid.yml << 'EOF'
development:
  clients:
    default:
      uri: <%= ENV['MONGODB_URI'] || 'mongodb://127.0.0.1:27017/tasknexus_dev' %>
production:
  clients:
    default:
      uri: <%= ENV['MONGODB_URI'] %>
EOF

# 4) initializers/jwt.rb
cat > ruby/initializers/jwt.rb << 'EOF'
JWT_SECRET = ENV['JWT_SECRET'] || 'super$ecretKey'  # change in prod!
def issue_token(payload)
  JWT.encode(payload, JWT_SECRET, 'HS256')
end
def decode_token(token)
  JWT.decode(token, JWT_SECRET, true, algorithm: 'HS256')[0]
rescue
  nil
end
EOF

# 5) app/models/user.rb
cat > ruby/app/models/user.rb << 'EOF'
require 'mongoid'
require 'bcrypt'

class User
  include Mongoid::Document
  include Mongoid::Timestamps
  field :username,      type: String
  field :password_hash, type: String

  validates :username, presence: true, uniqueness: true
  validates :password_hash, presence: true

  def password=(raw)
    self.password_hash = BCrypt::Password.create(raw)
  end

  def authenticate(raw)
    BCrypt::Password.new(password_hash) == raw
  end
end
EOF

# 6) app/models/task.rb
cat > ruby/app/models/task.rb << 'EOF'
require 'mongoid'

class Task
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title,       type: String
  field :completed,   type: Mongoid::Boolean, default: false
  field :position,    type: Integer

  belongs_to :user

  validates :title, presence: true
end
EOF

# 7) app/controllers/auth_controller.rb
cat > ruby/app/controllers/auth_controller.rb << 'EOF'
require 'sinatra/base'
require 'json'
require_relative '../models/user'
require_relative '../../initializers/jwt'

class AuthController < Sinatra::Base
  post '/register' do
    data = JSON.parse(request.body.read)
    user = User.new(username: data['username'])
    user.password = data['password']
    halt 400, { error: user.errors.full_messages }.to_json unless user.save
    token = issue_token({ user_id: user.id.to_s })
    { token: token }.to_json
  end

  post '/login' do
    data = JSON.parse(request.body.read)
    user = User.find_by(username: data['username']) rescue nil
    halt 401, { error: 'Invalid credentials' }.to_json unless user&.authenticate(data['password'])
    { token: issue_token({ user_id: user.id.to_s }) }.to_json
  end
end
EOF

# 8) app/controllers/tasks_controller.rb
cat > ruby/app/controllers/tasks_controller.rb << 'EOF'
require 'sinatra/base'
require 'json'
require_relative '../models/task'
require_relative '../models/user'
require_relative '../../initializers/jwt'

class TasksController < Sinatra::Base
  before do
    pass if request.path_info =~ %r{^/tasks/public}
    auth_header = request.env['HTTP_AUTHORIZATION'] || ''
    token = auth_header.split(' ').last
    payload = decode_token(token)
    halt 401, { error: 'Unauthorized' }.to_json unless payload
    @current_user = User.find(payload['user_id']) rescue nil
    halt 401, { error: 'Unauthorized' }.to_json unless @current_user
  end

  # public endpoint for stats
  get '/tasks/public/stats' do
    total = Task.count
    completed = Task.where(completed: true).count
    { total: total, completed: completed, incomplete: total - completed }.to_json
  end

  # CRUD
  get '/tasks' do
    tasks = @current_user.tasks.order_by(:position.asc)
    tasks.to_json
  end

  post '/tasks' do
    data = JSON.parse(request.body.read)
    task = @current_user.tasks.new(title: data['title'], position: data['position'])
    halt 400, { error: task.errors.full_messages }.to_json unless task.save
    status 201
    task.to_json
  end

  put '/tasks/:id' do
    task = @current_user.tasks.find(params['id'])
    data = JSON.parse(request.body.read)
    task.update(title: data['title'], completed: data['completed'], position: data['position'])
    task.to_json
  end

  delete '/tasks/:id' do
    task = @current_user.tasks.find(params['id'])
    task.destroy
    status 204
  end
end
EOF

# 9) app.rb (main entry)
cat > ruby/app.rb << 'EOF'
require 'sinatra/base'
require 'mongoid'
require 'rack/cors'
require_relative './config/mongoid'
require_relative './initializers/jwt'
require_relative 'app/controllers/auth_controller'
require_relative 'app/controllers/tasks_controller'

Mongoid.load!('config/mongoid.yml', ENV['RACK_ENV'] || :development)

class TaskNexusApp < Sinatra::Base
  use Rack::Cors do
    allow do
      origins '*'
      resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
    end
  end

  use AuthController
  use TasksController

  get '/' do
    'TaskNexus API is running!'
  end
end

run TaskNexusApp
EOF

# 10) config.ru for Rack
cat > ruby/config.ru << 'EOF'
require './app'
run TaskNexusApp
EOF

# 11) Dockerfile
cat > ruby/Dockerfile << 'EOF'
FROM ruby:3.1

WORKDIR /usr/src/app
COPY Gemfile* ./
RUN bundle install

COPY . .
EXPOSE 4567
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]
EOF

# 12) .env.example
cat > ruby/.env.example << 'EOF'
MONGODB_URI=mongodb://mongo:27017/tasknexus_prod
JWT_SECRET=replace_with_strong_secret
EOF

echo "✅ Ruby backend scaffold complete under ruby/"
echo "• To run locally without Docker:"
echo "    cd ruby"
echo "    export MONGODB_URI=mongodb://127.0.0.1:27017/tasknexus_dev"
echo "    bundle install"
echo "    bundle exec rackup"
echo "• To run via Docker:"
echo "    cd ruby"
echo "    docker build -t hoangsonww/tasknexus-api ."
echo "    docker run -e MONGODB_URI=mongodb://host.docker.internal:27017/tasknexus_dev -e JWT_SECRET=you_choose --rm -p 4567:4567 hoangsonww/tasknexus-api"
