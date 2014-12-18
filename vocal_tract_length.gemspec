# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'vocal_tract_length/version'

Gem::Specification.new do |spec|
  spec.name          = "vocal_tract_length"
  spec.version       = VocalTractLength::VERSION
  spec.authors       = ["Max Holder"]
  spec.email         = ["mxhold@gmail.com"]
  spec.summary       = %q{Calculate your vocal tract length by recording your voice}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0")
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_dependency 'sinatra'
  spec.add_dependency 'sinatra-praat'
end
