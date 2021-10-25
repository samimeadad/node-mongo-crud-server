const express = require( 'express' );
const cors = require( 'cors' );
const ObjectId = require( 'mongodb' ).ObjectId;
const { MongoClient } = require( 'mongodb' );
const app = express();
const port = 5000;

//middleware
app.use( cors() );
app.use( express.json() );

//user: mydbuser1
//pass: xyoioXq3IDKckmPL


const uri = "mongodb+srv://mydbuser1:xyoioXq3IDKckmPL@cluster0.iezc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

async function run () {
    try {
        await client.connect();

        const database = client.db( "foodMaster" );
        const usersCollection = database.collection( "users" );

        //GET API
        app.get( '/users', async ( req, res ) => {
            const cursor = usersCollection.find( {} );
            const users = await cursor.toArray();
            res.send( users );
        } )

        //FIND & DISPLAY API
        app.get( '/users/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const user = await usersCollection.findOne( query );
            res.send( user );
        } )

        //POST API
        app.post( '/users', async ( req, res ) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne( newUser );
            console.log( 'Got a new user', req.body );
            console.log( 'added a new user', result );
            res.json( result );
        } )

        //UPDATE API
        app.put( '/users/:id', async ( req, res ) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId( id ) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };

            const result = await usersCollection.updateOne( filter, updateDoc, options );
            console.log( 'updating user', req );
            res.json( result );
        } )

        //DELETE API
        app.delete( '/users/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await usersCollection.deleteOne( query );
            console.log( 'deleting user', result );
            res.json( result );
        } )

    } finally {
        // await client.close();

    }

}
run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'My CRUD server is running fine' );
} )

app.listen( port, () => {
    console.log( "CRUD Server is running on port", port );
} )