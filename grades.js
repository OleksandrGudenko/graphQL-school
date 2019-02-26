let express = require('express');
let bodyParser = require('body-parser');
let schoolData = require('./db');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const schema = gql`
  type Mutation {    
    assignGrade(
      grade: String!,
      studentId: String!,
      courseId: String!,
      date: String!,
     ): status!,
    modifyGrade(
      id: ID!,
      grade: String,
      studentId: String,
      studentName: String,
      courseId: String,
      courseName: String,
      date: String,
    ):status!,
    removeGrade(id: ID!): status!
  }

  type status {
    success: Boolean!    
  }

  type Query {
    grade(id: ID!): Grade,
    grades: [Grade!]!,
    
  }

  type Grade {
    id: ID!,
    grade: String!,
    student: Student,
    course: Course,
    date: String!,
  }

  type Student {
    studentId: String!,
    studentName: String!
  }

  type Course {
    courseId: String!,
    courseName: String!
  }

`;


const resolvers = {
  Query: {
    grade: (parent, args, context, info) => {      
      return schoolData.db.grades.find(g => g.id == args.id);
    },
    grades: (parents, args, context, info) => {
      return schoolData.db.grades;
    },   
  },

  Mutation: {
    assignGrade: (parent, args, context, info) => { 

        let studentId = null;
        let studentName = null;

        if(args.studentId) {
            let studIndex = schoolData.db.students.findIndex(s => s.id == args.studentId);
            studentId = args.studentId;
            studentName = schoolData.db.students[studIndex].name;
        }

        let courseId = null;
        let courseName = null;
        if (args.courseId) {
            let courseIndex = schoolData.db.courses.findIndex(c => c.id == args.courseId);
            courseId = args.courseId;
            courseName = schoolData.db.courses[courseIndex].description;
        }

      var newGrade = {
        id: schoolData.db.grades.length +1,
        grade: args.grade,
        studentId: studentId,
        studentName: studentName,
        courseId: courseId,
        courseName: courseName,
        date: args.date
      }

      schoolData.db.grades.push(newGrade);

      return { success: true }
    },

    modifyGrade: (parent, args, context, info) => {
      var selectedGradeIndex = schoolData.db.grades.findIndex(g => g.id == args.id);
      if (args.grade) {
        schoolData.db.grades[selectedGradeIndex].grade = args.grade;
      }
      if (args.studentId) {
        if(schoolData.db.students.find(s => s.id == args.studentId)) {
            schoolData.db.grades[selectedGradeIndex].studentId = args.studentId;
        }
      }
      if (args.studentName) {
        if (schoolData.db.students.find(s => s.name == args.studentName)) {
           schoolData.db.grades[selectedGradeIndex].studentName = args.studentName;
        }
      }
      if (args.courseId) {
        if (schoolData.db.courses.find(c => c.id == args.courseId)) {
            schoolData.db.grades[selectedGradeIndex].courseId = args.courseId;
        }
      }
      if (args.courseName) {
        if (schoolData.db.courses.find(c => c.description == args.courseName)) {
            schoolData.db.grades[selectedGradeIndex].courseName = args.courseName;
        }
      }
      if(args.date) {
        schoolData.db.grades[selectedGradeIndex].date = args.date;
      }

      return { success: true };
    },

    removeGrade: (parent, args, context, info) => {

      var delGrade = schoolData.db.grades.findIndex(g => g.id == args.id);
      schoolData.db.grades.splice(delGrade, 1);  

      return { success: true };  
    }
  },
  
  Grade: {
      student: (parent, args, context, info) =>
      {
        return {
          studentId: parent.studentId,
          studentName: parent.studentName
        }
      },
      course: (parent, args, context, info) => {
        return {
          courseId: parent.courseId,
          courseName: parent.courseName,

        }
      },
    }
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