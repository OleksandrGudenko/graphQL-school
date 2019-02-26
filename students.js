let express = require('express');
let bodyParser = require('body-parser');
let studentsData = require('./db');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Mutation {    
    createStudent(
      email: String!,
      name: String!,
      studentGroupId: String!,
      birthday: String!,
     ): status!,
    modifyStudent(
      id: ID!,
      email: String,
      name: String,
      studentGroupId: String,
      birthday: String
    ):status!,
    removeStudent(id: ID!): status!
  }
  

  type status {
    success: Boolean!    
  }

  type Query {
    student(id: ID!): Student,
    students: [Student!]!,
    
  }

  type Student {
    id: ID!,
    email: String!,
    name: String!,
    studentGroupId: String!,
    birthday: String!,
  }

`;


const resolvers = {
  Query: {
    student: (parent, args, context, info) => {      
      return studentsData.db.students.find(u => u.id == args.id);
    },
    students: (parents, args, context, info) => {
      return studentsData.db.students;
    },   
  },

  Mutation: {
    createStudent: (parent, args, context, info) => { 

      var newStudent = {
        id: studentsData.db.students.length +1,
        email: args.email,
        name: args.name,
        birthday: args.birthday,
        studentGroupId: args.studentGroupId
      }

      studentsData.db.students.push(newStudent);

      return { success: true }
    },

    modifyStudent: (parent, args, context, info) => {
      var selectedStudentIndex = studentsData.db.students.findIndex(s => s.id == args.id);
      if (args.name) {
        studentsData.db.students[selectedStudentIndex].name = args.name;
      }
      if (args.birthday) {
        studentsData.db.students[selectedStudentIndex].birthday = args.birthday;
      }
      if (args.studentGroupId) {
        studentsData.db.students[selectedStudentIndex].studentGroupId = args.studentGroupId;
      }
      if(args.email) {
        studentsData.db.students[selectedStudentIndex].email = args.email;
      }

      return { success: true };
    },

    removeStudent: (parent, args, context, info) => {

      var delStud = studentsData.db.students.findIndex(s => s.id == args.id);
      studentsData.db.students.splice(delStud, 1);  

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