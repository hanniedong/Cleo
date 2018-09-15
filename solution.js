const fs = require("fs");

//global variables
let inputArray = [];
let inputString = "";

//sets the character encoding for data read from the Readable stream.
process.stdin.setEncoding("utf8");

//The 'readable' event is emitted when there is data available to be read
//Store data into the input string
process.stdin.on("readable", () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    inputString += chunk;
  }
});

//The 'end' event is emitted when there is no more data to be consumed
//Splits the input string into an array of reports
process.stdin.on("end", () => {
  inputArray = inputString.split("\n");
  main();
});

//takes in inputArray, manipulates data, and outputs a JSONObject
const main = () => {
  const formattedReportsArray = formatReports(inputArray);
  const result = createJSONObject(formattedReportsArray);
  const JSONObject = JSON.stringify(result);
  fs.writeFile("output.JSON", JSONObject, err => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

//Valid reports follow three formats. Returns a copy of the dataArray with the correct order for the JSON object
const formatReports = dataArray => {
  //CompanyName -- PackageName:EmployeeEmails
  const format1 = /--/;
  //PackageName:CompanyName:EmployeeEmails
  const format2 = /:/;
  //EmployeeEmails;PackageName;CompanyName
  const format3 = /;/;

  //splits report string into an array based on format type
  return dataArray.map(report => {
    if (format1.test(report)) {
      return orderReportArray(report.split(/-- |:/), "switch");
    } else if (format2.test(report)) {
      return report.split(":");
    } else if (format3.test(report)) {
      return orderReportArray(report.split(";"), "rotate");
      //Handles invalid formats
    } else if (report.length > 0) {
      return report.split();
      //Handles blank lines
    } else return "";
  });
};

//returns a copy of the reportArray that has the correct order for JSON object
const orderReportArray = (reportArray, type) => {
  const orderedReportArray = Object.assign(reportArray);
  switch (type) {
    case "switch":
      let temp = orderedReportArray[0];
      orderedReportArray[0] = orderedReportArray[1];
      orderedReportArray[1] = temp;
      return orderedReportArray;
    case "rotate":
      orderedReportArray.push(orderedReportArray.shift());
      return orderedReportArray;
    default:
      null;
  }
};

//Creates JSON Object
const createJSONObject = formattedReportsArray => {
  const JSONObjectArray = [];
  const errorsObject = { errors: [] };

  //handles empty report file
  if (formattedReportsArray[0] === "" && formattedReportsArray.length === 1)
    return "There are no reports";

  formattedReportsArray.forEach(report => {
    const errors = handleErrors(report);

    //ignores empty reports
    if (report !== "") {
      //checks to see if report object already exists and adds email and count to existing report
      if (doesReportExist(report, JSONObjectArray)) {
        modifyReport(report, JSONObjectArray);
      } else {
        errors.length === 0
          ? JSONObjectArray.push({
              package: report[0],
              company: report[1],
              emails: sortAndFindDuplicateEmails(findValidEmails(report[2])),
              count: 1
            })
          : errorsObject.errors.push({ error: errors, report: report });
      }
    }
  });
  const sortedJSONObjectArray = sortJSONObjectArray(JSONObjectArray);
  return errorsObject.errors.length !== 0
    ? [...sortedJSONObjectArray, errorsObject]
    : [sortedJSONObjectArray];
};

//searches for errors in report
const handleErrors = report => {
  const errorsArray = [];
  if (isReportValid(report) === false) {
    errorsArray.push("Report is not in the proper format");
  }
  if (doEmailsExist(report[2]) === false) {
    errorsArray.push("There are no valid emails");
  }
  return errorsArray;
};

//indicates if report contains all the attributes
const isReportValid = report => report.length >= 3;

//If a package has no valid emails, exclude that package from the results.
const doEmailsExist = emails => {
  if (emails) return findValidEmails(emails).length > 0;
};

//Validates emails
const findValidEmails = emails => {
  if (emails)
    return emails
      .split(",")
      .filter(email => /[a-zA-Z-]*@[a-zA-Z-.]*/.test(email));
};

//finds duplicates emails and sorts alphabetically
const sortAndFindDuplicateEmails = emails => [...new Set(emails)].sort();

//Indicates if an object with the same company and package already exists
const doesReportExist = (report, jsonObjectArray) =>
  jsonObjectArray.some(
    object =>
      report.indexOf(object.company) !== -1 &&
      report.indexOf(object.package) !== -1
  );

const modifyReport = (report, jsonObjectArray) => {
  //finds existing report
  const result = jsonObjectArray.find(
    reportObject =>
      reportObject.package === report[0] && reportObject.company === report[1]
  );

  //modify emails
  const existingEmails = result.emails;
  result.emails = sortAndFindDuplicateEmails([
    ...existingEmails,
    ...findValidEmails(report[2])
  ]);

  //increase count
  result.count++;
};

//The array should be sorted alphabetically (case-insensitive) by package name
const sortJSONObjectArray = JSONObjectArray => {
  return JSONObjectArray.sort((object1, object2) => {
    let package1 = object1.package.toUpperCase(); // ignore upper and lowercase
    let package2 = object2.package.toUpperCase(); // ignore upper and lowercase
    return package1 < package2 ? -1 : package1 > package2 ? 1 : 0;
  });
};

module.exports = {
  sortJSONObjectArray,
  createJSONObject,
  formatReports
};
