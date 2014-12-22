require 'sinatra/base'
require 'sinatra/praat'

module VocalTractLength
  class App < Sinatra::Base
    register Sinatra::Praat

    set :public_folder, __dir__ + '/public'

    get '/' do
      send_file File.expand_path('index.html', settings.public_folder)
    end
  end
end
