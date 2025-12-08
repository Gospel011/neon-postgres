import os from "node:os";

function getLANIP() {
  let lanIp: string | undefined = undefined;
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaceAddress = networkInterfaces[interfaceName]?.find(
      (network) => network.family === "IPv4" && !network.internal
    )?.address;

    if (!!interfaceAddress) {
      lanIp = interfaceAddress;
      break;
    }
  }

  return lanIp;
}

export default getLANIP;