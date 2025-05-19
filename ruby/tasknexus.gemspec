Gem::Specification.new do |s|
  s.name        = "tasknexus"
  s.version     = "1.0.1"
  s.summary     = "TaskNexus API service (Sinatra + Mongoid + JWT)"
  s.description = "A full-featured backend API for TaskNexus, built with Sinatra, Mongoid, and JWT authentication."
  s.authors     = ["Son Nguyen"]
  s.email       = ["hoangson091104@gmail.com"]
  s.homepage    = "https://github.com/hoangsonww/Task-Manager-ReactNative"
  s.license     = "MIT"

  # link this gem to your GitHub repo so it shows up in Packages
  s.metadata    = {
    "github_repo" => "https://github.com/hoangsonww/Task-Manager-ReactNative"
  }

  s.required_ruby_version = ">= 2.7.0"

  s.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir[
      "app/**/*.rb",
      "config/**/*.yml",
      "initializers/**/*.rb",
      "app.rb",
      "config.ru",
      "Gemfile*",
      "Dockerfile",
      ".env.example"
    ]
  end

  s.require_paths = ["app", "."]

  # runtime dependencies
  s.add_dependency "sinatra",   "~> 2.1"
  s.add_dependency "mongoid",   "~> 7.3"
  s.add_dependency "jwt",       "~> 2.6"
  s.add_dependency "bcrypt",    "~> 3.1"
  s.add_dependency "rack-cors", "~> 1.1"
end
