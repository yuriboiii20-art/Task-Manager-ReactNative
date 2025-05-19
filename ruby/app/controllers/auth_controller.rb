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
