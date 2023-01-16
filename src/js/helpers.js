import { WAITING_TIME } from "./config.js";

const timeout = function (waitingTime) {
  return new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Request took too long! Timeout after ${waitingTime} ${
              waitingTime === 1 ? "second" : "seconds"
            }`
          )
        ),
      waitingTime * 1000
    )
  );
};

export const AJAXCall = async function (URL, dataToUpload = undefined) {
  try {
    const fetchPro = dataToUpload
      ? fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpload),
        })
      : fetch(URL);

    const serverResponse = await Promise.race([
      timeout(WAITING_TIME),
      fetchPro,
    ]);

    const serverResponseData = await serverResponse.json();

    if (!serverResponse.ok)
      throw new Error(
        `Something went wrong, ${serverResponseData.message}(${serverResponse.status}) 💥`
      );

    return serverResponseData;
  } catch (error) {
    throw error;
  }
};
