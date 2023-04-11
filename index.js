const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express;

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use('/api/users', users);
app.use('/api/auth', auth);

mongoose.connect('mongodb://127.0.0.1:27017/playground')
    .then(() => console.log('Connected to mongodb...'))
    .catch(err => console.log('Could not connect to mongodb...', err));

    // Defines a set of rules/characteristics for the database
    const Schema = mongoose.Schema({
        name: {
            type: String, 
            required: true,
            minlength: 5,
            maxlenth: 255
        },
        category: {
            type: String,
            required: true,
            enum: ['web', 'mobile', 'network'],
            lowercase: true,
            trim: true
        },
        author: String,
        tags: {
            type: Array,
            validate: {
                isAsync: true,
                validator: function (v, callback) {
                    setTimeout(() => {
                        const result = v && v.length > 0;
                        callback(result);
                    }, 4000);
                },
                message: 'A course should have atleast one tag.'
            }
        },
        date: {type: Date, default: Date.now},
        isPublished: Boolean,
        price: {
            type: Number,
            required: function() {return this.isPublished;},
            min: 10,
            max: 200,
            get: v => Math.round(v),
            set: v => Math.round(v)
        }
    })

