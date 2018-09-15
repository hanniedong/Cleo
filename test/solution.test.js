const {
  sortJSONObjectArray,
  createJSONObject,
  formatReports
} = require("../solution");

describe("formatReports()", () => {
  it("should return an array", () => {
    expect(formatReports([])).toEqual([]);
  });
  it("should return an ordered array if it matches format 1", () => {
    expect(
      formatReports(["Cleo Select:Slack:foo@slack.fake.com,bar@slack.fake.com"])
    ).toEqual([
      ["Cleo Select", "Slack", "foo@slack.fake.com,bar@slack.fake.com"]
    ]);
  });
  it("should return an ordered array if it matches format 2", () => {
    expect(
      formatReports(["CompanyName -- PackageName:EmployeeEmails"])
    ).toEqual([["PackageName", "CompanyName ", "EmployeeEmails"]]);
  });
  it("should return an ordered array if it matches format 3", () => {
    expect(formatReports(["EmployeeEmails;PackageName;CompanyName"])).toEqual([
      ["PackageName", "CompanyName", "EmployeeEmails"]
    ]);
  });
});

describe("createJSONObject()", () => {
  it("should return 'There are no reports' if there are no reports", () => {
    expect(createJSONObject([""])).toBe("There are no reports");
  });
  it("should return a JSON object if there's a report", () => {
    expect(
      createJSONObject([
        ["Cleo Select", "Slack", "foo@slack.fake.com,bar@slack.fake.com"]
      ])
    ).toEqual([
      [
        {
          company: "Slack",
          count: 1,
          emails: ["bar@slack.fake.com", "foo@slack.fake.com"],
          package: "Cleo Select"
        }
      ]
    ]);
  });
  it("should return a JSON object with an errors object if there is a report with an error", () => {
    expect(
      createJSONObject([
        ["Cleo Select", "Slack", "foo@slack.fake.com,bar@slack.fake.com"],
        ["Corrupted File"]
      ])
    ).toEqual([
      {
        company: "Slack",
        count: 1,
        emails: ["bar@slack.fake.com", "foo@slack.fake.com"],
        package: "Cleo Select"
      },
      {
        errors: [
          {
            error: ["Report is not in the proper format"],
            report: ["Corrupted File"]
          }
        ]
      }
    ]);
  });
  it("adds email and count to an existing report", () => {
    expect(
      createJSONObject([
        ["Cleo Select", "Slack", "foo@slack.fake.com,bar@slack.fake.com"],
        ["Cleo Select", "Slack", "banana@slack.fake.com,cat@slack.fake.com"]
      ])
    ).toEqual([
      [
        {
          company: "Slack",
          count: 2,
          emails: [
            "banana@slack.fake.com",
            "bar@slack.fake.com",
            "cat@slack.fake.com",
            "foo@slack.fake.com"
          ],
          package: "Cleo Select"
        }
      ]
    ]);
  });
});

describe("sortJSONObjectArray()", () => {
  it("should return an array sorted by package name", () => {
    expect(
      sortJSONObjectArray([{ package: "Sun" }, { package: "Moon" }])
    ).toEqual([{ package: "Moon" }, { package: "Sun" }]);
  });
});
