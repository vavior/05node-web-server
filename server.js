const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(`${__dirname}/views/partials`);
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', `${log}\n`, (err) => {
        if (err) console.log('Could\'t append log.');
    });
    console.log(log);
    next();
});
// next is called to inform the app when the middleware is finished and therefore can continue to run.
// This means that if we don't call next, the handlers below won't fire.

app.use((req, res, next) => {
    res.render('maintenance.hbs');
});

app.use(express.static(`${__dirname}/public`));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());

hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMsg: 'Hey there! Nice to meet you!'
    });
    // res.send({
    //     name: 'Stef',
    //     arr: [
    //         'hey', 'hello'
    //     ]
    // });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page'
    });
});

app.get('/bad', (req, res) => {
    res.send('Bad request');
});

app.listen(port, () => console.log(`Server is up on port ${port}`));
// instead of port 3000, we'll use an environment variable that heroku will set
// heroku will tell our app which port to use because that port will change as you deploy your app
