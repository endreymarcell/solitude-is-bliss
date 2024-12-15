import { getChange, LOCAL_STORAGE_KEY, log, parseStorageContents } from "./utils";

let myInstanceId: number | null = null;
let currentlyOpenInstances: number[] = [];

export function initSolitude() {
  myInstanceId = Date.now();
  const storageContents = localStorage.getItem(LOCAL_STORAGE_KEY);
  const parsedStorageContents = parseStorageContents(storageContents);
  const updatedInstances = [...parsedStorageContents, myInstanceId];

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInstances));
  currentlyOpenInstances = updatedInstances;

  window.addEventListener("storage", onChange);
  window.addEventListener("beforeunload", removeMyself);

  log("Initialized", myInstanceId, "-- currently open:", updatedInstances);
}

function onChange() {
  const storageContents = localStorage.getItem(LOCAL_STORAGE_KEY);
  const parsedStorageContents = parseStorageContents(storageContents);
  const change = getChange(currentlyOpenInstances, parsedStorageContents);
  currentlyOpenInstances = parsedStorageContents;

  if (change.type === "joined") {
    log("Instance joined:", change.instanceId, "-- currently open:", currentlyOpenInstances.join(", "));
  } else if (change.type === "left") {
    log("Instance left:", change.instanceId, "-- currently open:", currentlyOpenInstances.join(", "));
  } else {
    log("Unsupported change detected");
  }
}

function removeMyself() {
  const storageContents = localStorage.getItem(LOCAL_STORAGE_KEY);
  const parsedStorageContents = parseStorageContents(storageContents);
  const updatedInstances = parsedStorageContents.filter((instanceId) => instanceId !== myInstanceId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedInstances));
}
