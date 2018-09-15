# Cleo Code Challenge

### Background
When companies subscribe to a Cleo benefit package, any of their employees who are expecting, adopting, or who have recently had a child gain access to our platform. In some cases, families who are considering having a child are also eligible. 

Periodic reports with the email addresses of newly eligible employees are given. There is some variation in the report format based on company HR system, but they all contain the same basic information:
- Company name
- Package name (determines terms of eligibility, pricing, and offerings)
- Employee emails (comma-separated)

### How to Run the Program 
Program is written in Javascript ES6.
1) Make sure node version is correct. I used `node version: v10.10.0` when creating this program. Also compabible with `node version: v8`
  -Check for node version by typing `node -v` 
2) Run `npm install` to install dependencies 
3) Within commandline run `node solution.js < *.txt`

### How to Run Tests
Utilized Jest testing framework to create tests. 
1) After running `npm install` run `npm test` to run tests.

### Input
- Program will receive its input from any .txt file 
- Each line corresponds to a single “report”. Valid reports follow one of these formats:

#### Format 1:
```
PackageName:CompanyName:EmployeeEmails
```

Example:
```
Cleo Select:Slack:foo@slack.fake.com,bar@slack.fake.com
```

#### Format 2:
```
CompanyName -- PackageName:EmployeeEmails
```

Example:
```
Slack -- Cleo Select:foo@slack.fake.com,bar@slack.fake.com
```

#### Format 3:
```
EmployeeEmails;PackageName;CompanyName
```

Example:
```
foo@slack.fake.com,bar@slack.fake.com;Cleo Select;Slack
```

- Program does not crash if it encounters an improperly formatted record, but continue counting valid records.
- Program skips blank lines and not count them as errors for reporting purposes.
- Valid email address consists of one or more alphanumeric characters, periods, and/or hyphens, followed by the "@" symbol, followed again by one or more alphanumeric characters, periods, and hyphens. If an email does not match this pattern, ignore it.

### Output
- Produce an array of objects, where each object represents a package. Each object will have the following keys:
    - `package`: the package name (value: string)
    - `company`: the company name (value: string)
    - `emails`: a list of unique emails, sorted alphabetically (value: array of strings)
    - `count`: the number of reports in which the package appeared (value: int)
- Results are written to `output.json`.
- Results are encoded as JSON.
- A company can subscribe to more than one package. Each package is treated as a separate object in the array.
- Different companies can have packages with the same name. These should appear as separate objects in the array.
- The array should be sorted alphabetically (case-insensitive) by package name.
- Email values are be sorted alphabetically and not duplicated.
- If a package has no valid emails, package is excluded from the results.


### Errors 
Errors are included in the `output.json`
- Program indicates if:
  1) The report is in an invalid format 
  2) The report does not contain any valid emails 
  3) The report is empty
