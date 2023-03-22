const fs = require("fs");
const { parse } = require("csv-parse");

let prev = 0;
let array = [];
let storedObject = {};
let index = 0;
fs.createReadStream("./communes-departement-region.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    if (
      !["98", "97", "976", "", "98", "99", "974", "973", "972", "971"].includes(
        row[11]
      )
    ) {
      if (index === 0) {
        const departmentCode = row[11].length === 1 ? "0" + row[11] : row[11];

        storedObject = {
          label: [row[12]],
          data: {
            code: departmentCode,
            department: departmentCode,
            postalCodes: [departmentCode],
          },
          selected: false,
          enabled: true,
          opened: false,
          type: "DEPARTMENT",
          parent: null,
          children: [
            {
              label: [row[9]],
              data: {
                code: row[0],
                department: departmentCode,
                postalCodes: [row[2]],
              },
              selected: false,
              enabled: true,
              opened: false,
              type: "CITY",
              parent: departmentCode,
            },
          ],
        };
        prev = row[11];
      } else {
        if (row[11] === prev) {
          const departmentCode = row[11].length === 1 ? "0" + row[11] : row[11];
          if (
            storedObject.children &&
            // storedObject.children?.find((child) => child.data.code === row[2])
            //   ? false
            //   : true
            //   &&
            row[11] === row[0].substring(0, row[11].length)
          ) {
            const child = storedObject.children?.find(
              (child) => child.data.code === row[0]
            );

            if (child ? true : false) {
              // child.label.push(row[9]);

              const hasPostalCode = Boolean(
                child.data.postalCodes.find((postalCode) => {
                  return postalCode === row[2];
                })
              );

              if (!hasPostalCode) {
                child.data.postalCodes.push(row[2]);
              }
            } else {
              storedObject.children.push({
                label: [row[9]],
                data: {
                  code: row[0],
                  department: departmentCode,
                  postalCodes: [row[2]],
                },
                selected: false,
                enabled: true,
                opened: false,
                type: "CITY",
                parent: departmentCode,
              });
            }
          }

          prev = row[11];
        } else {
          array.push(storedObject);
          prev = row[11];

          const departmentCode = row[11].length === 1 ? "0" + row[11] : row[11];
          storedObject = {
            label: [row[12]],
            data: {
              code: departmentCode,
              department: departmentCode,
              postalCodes: [departmentCode],
            },
            selected: false,
            enabled: true,
            opened: false,
            type: "DEPARTMENT",
            parent: null,
            children: [
              {
                label: [row[9]],
                data: {
                  code: row[0],
                  department: departmentCode,
                  postalCodes: [row[2]],
                },
                selected: false,
                enabled: true,
                opened: false,
                type: "CITY",
                parent: departmentCode,
              },
            ],
          };
        }
      }
      index++;
    }
  })
  .on("end", function () {
    array.push(storedObject);
    const fs = require("fs");

    const content = JSON.stringify(array);

    fs.writeFile("./departmentPostCodes.json", content, (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
    //  console.log(array);
  });
