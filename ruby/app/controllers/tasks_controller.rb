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
