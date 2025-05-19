JWT_SECRET = ENV['JWT_SECRET'] || 'super$ecretKey'  # change in prod!
def issue_token(payload)
  JWT.encode(payload, JWT_SECRET, 'HS256')
end
def decode_token(token)
  JWT.decode(token, JWT_SECRET, true, algorithm: 'HS256')[0]
rescue
  nil
end
