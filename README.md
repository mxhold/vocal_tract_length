# Vocal Tract Length

This small Sinatra application provides the frontend for users to record their
voice in order to calculate the length of their vocal tract.

# Backend

To see the [Praat](http://praat.org) script and the Sinatra extension that provides the
`/extract_formant1` route, see the
[sinatra-praat](https://github.com/mxhold/sinatra-praat) project.

# How to Run

1. Install a recent version of [Ruby](https://ruby-lang.org)
2. Install [Praat](http://praat.org) and add it to your $PATH
3. Clone the project: `git clone https://github.com/mxhold/vocal_tract_length`
4. Run `bundle install`
5. Run `rackup`
6. It should be running at
   [http://localhost:9292/vocal_tract_length/index.html](http://localhost:9292/vocal_tract_length/index.html)

