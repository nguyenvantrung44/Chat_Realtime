import moment from "moment";

export let bufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString("base64");
};

export let lastItemOfArray = (array) => {
  if (!array.length) {
    return [];
  }
  return array[array.length - 1];
};

export let convertTimestampToHumanTime = (timestamp) => {
  if (!timestamp) {
    return "";
  } else {
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
  }
}
