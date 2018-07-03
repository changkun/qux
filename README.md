# A Quantifid UX Metric

This repository implements [a research paper](http://www.medien.ifi.lmu.de/forschung/publikationen/detail?pub=lachner2016nordichi) of quantified UX metric.

## Development

To run the project on local:

```bash
brew isntall mongodb                          # install mongodb
brew services start mongodb                   # start mongodb service
cd server/database && ./import.sh && cd ../.. # init database
npm install                                   # install dependencies
npm run server                                # run server     shell-1
npm start                                     # run frontend   shell-2
```

Then you can access the website the website via `localhost:3000`.

## Deployment

You don't.

## License

Changkun Ou &copy; [MIT](./LICENSE)