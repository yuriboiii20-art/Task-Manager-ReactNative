require 'sinatra'
require 'json'
require 'time'

# Serve files in ./public as static assets
set :public_folder, File.expand_path('public', __dir__)
set :port, ENV.fetch('PORT', 4567)

# Log each request
before do
  logger.info "[#{Time.now.iso8601}] #{request.request_method} #{request.path}"
end

# Health-check endpoint
get '/health' do
  content_type :json
  { status: 'ok', time: Time.now.iso8601 }.to_json
end

# Stubbed tasks API
get '/api/tasks' do
  content_type :json
  tasks = [
    { id: 1, text: 'Sample task', color: '#ffcc00', due_date: (Time.now + 3600).iso8601, completed: false },
    { id: 2, text: 'Another task',  color: '#00ccff', due_date: (Time.now + 7200).iso8601, completed: true }
  ]
  tasks.to_json
end

# Fallback: serve index.html for single-page apps
get '*' do
  send_file File.join(settings.public_folder, 'index.html')
end
