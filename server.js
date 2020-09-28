const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
require('dotenv').config();
const {findOrCreateUser } = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser : true ,  useUnifiedTopology: true})
.then(()=> console.log('DB is Connected!'))
.catch(err => console.error(err));


const server =new ApolloServer ({
    typeDefs ,
    resolvers,
    context : async ({req}) => {
        let authToken = null;
        let currentUser = null;
        try{
           authToken = req.headers.authorization;
         if(authToken)
         {
            currentUser =await findOrCreateUser(authToken);
           
         }
        }catch(err){
            console.error(`Unable to authenticate the user with Token ${authToken}`);
        }
        return {currentUser};

    }
})

server.listen( {port :  process.env.PORT || 4000 }).then( ({url})=> {
 console.log(`Server is listening on ${url}`);
});