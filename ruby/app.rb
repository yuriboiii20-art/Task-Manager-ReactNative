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
