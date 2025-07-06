FROM ruby:3.1.0

WORKDIR /usr/src/app
COPY Gemfile* ./
RUN bundle install

COPY . .
EXPOSE 4567
CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "-p", "4567"]
