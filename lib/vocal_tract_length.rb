require 'sinatra/base'
require 'sinatra/praat'

module VocalTractLength
  class App < Sinatra::Base
    register Sinatra::Praat

    set :public_folder, __dir__ + '/public'
  end
end
