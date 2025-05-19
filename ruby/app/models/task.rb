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
