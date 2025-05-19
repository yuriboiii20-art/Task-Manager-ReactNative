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
