let express = require('express');
let bodyParser = require('body-parser');
let coursesData = require('./db');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Mutation {    
    createCourse(
      description: String!,
      teacherName: String!,
     ): status!,
    modifyCourse(
      id: ID!,
      description: String,
      teacherName: String,
    ):status!,
    removeCourse(id: ID!): status!
  }


  type status {
    success: Boolean!    
  }

  type Query {
    course(id: ID!): Course,
    courses: [Course!]!,
    
  }

  type Course {
    id: ID!,
    description: String!,
    teacherName: String!,
  }

`;

const resolvers = {
  Query: {
    course: (parent, args, context, info) => {      
      return coursesData.db.courses.find(c => c.id == args.id);
    },
    courses: (parents, args, context, info) => {
      return coursesData.db.courses;
    },   
  },

  Mutation: {
    createCourse: (parent, args, context, info) => { 

      var newCourse = {
        id: coursesData.db.courses.length +1,
        description: args.description,
        teacherName: args.teacherName,
      }

      coursesData.db.courses.push(newCourse);

      return { success: true }
    },

    modifyCourse: (parent, args, context, info) => {
      var selectedCourseIndex = coursesData.db.courses.findIndex(s => s.id == args.id);
      if (args.description) {
        coursesData.db.courses[selectedCourseIndex].description = args.description;
      }
      if (args.teacherName) {
        coursesData.db.courses[selectedCourseIndex].teacherName = args.teacherName;
      }

      return { success: true };
    },

    removeCourse: (parent, args, context, info) => {

      var delCourse =  coursesData.db.courses.findIndex(c => c.id == args.id);
      coursesData.db.courses.splice(delCourse, 1);  

      return { success: true };  
    }
  },
  

};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});