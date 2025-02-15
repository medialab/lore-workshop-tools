export function downloadTextfile(
  data: string,
  filename: string = "selfie-data.json",
  mimetype: string = "application/json"
): void {
  const blob = new Blob([data], { type: mimetype })
  const dlURL = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = dlURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
}

export function JSONArrayToCSVStr(items: Array<object> = []): string {
  const replacer = (key, value) => (value === null ? "" : value) // specify how you want to handle null values here
  const header = new Set(Object.keys(items[0]))
  const outputItems = items.map((item) => {
    const outputItem = {}
    Object.entries(item).forEach(([key, value]) => {
      let outputValue = value
      if (!header.has(key)) {
        header.add(key)
      }

      if (value === undefined || value === null) {
        outputItem[key] = ""
      } else if (typeof value === "object") {
        if (Array.isArray(value) && value.length) {
          // const subHeader = Object.keys(value[0]);
          // outputItem[key] = [
          //   subHeader.join('|'),
          //   ...value.map((subValue) => {
          //       console.log(subValue)
          //       return subHeader.map(subKey => {
          //           return subValue[subKey] ? JSON.stringify(subValue[subKey]) : '';
          //       }).join('|')
          //     })

          // ].join('||');
          outputValue = JSON.stringify(value)
          outputValue = outputValue.replace(/,/g, "|") //.replace(/"/g, '\\"').;
          outputItem[key] = outputValue
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            const csvKey = `${key}.${subKey}`
            if (!header.has(csvKey)) {
              header.add(csvKey)
            }
            outputItem[csvKey] = subValue // JSON.stringify(subValue, replacer)
          })
        }
      } else {
        outputValue = value // JSON.stringify(value, replacer);
        outputItem[key] = outputValue
      }
    })
    return outputItem
  })
  // console.log('outputItems', outputItems);
  const headerArray: Array<string> = Array.from(header).sort()
  const csv = [
    headerArray.join(","), // header row first
    ...outputItems.map((row) =>
      headerArray
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    )
  ].join("\r\n")
  return csv
}