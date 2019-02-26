
module.exports.db= {
  students:[
    {
      id: "1",
      email: "john.wick@email.com",
      name: "John Wick",
      birthday: "2010-02-28",
      studentGroupId: "DIN17SP"
    },
    {
      id: "2",
      email: "shaggy.rogers@email.com",
      name: "Shaggy Rogers",
      birthday: "2001-12-24",
      studentGroupId: "DIN17SP"
    }
  ],
  courses:[
    {
      id: "1",
      description: "Reggae Class",
      teacherName: "Bob Marley",
    },
    {
      id: "2",
      description: "Reggae Class",
      teacherName: "Bob Marley",
    }
  ],
  grades:[
    {
      id: "1",
      grade: "4",
      studentId: "2",
      studentName: "Shaggy Rogers",
      courseId: "1",
      courseName: "Reggae Class",
      date: "2019-02-26",
    },
    {
      id: "2",
      grade: "1",
      studentId: "1",
      studentName: "John Wick",
      courseId: "2",
      courseName: "Reggae Class",
      date: "2019-02-26",
    }
  ]
}

