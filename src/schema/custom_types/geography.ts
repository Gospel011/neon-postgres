import { customType } from "drizzle-orm/pg-core";
import logger from "@logger";
import { inspect } from "util";

export default customType<{
  //   data: {
  //     coordinates: { lat: number; lng: number }; // TODO: SUITABLE FOR POINTS, ADD SUPPORT FOR OTHER GEOGRAPHY_SHAPES
  //     srid?: number;
  //     shape?: GEOGRAPHY_SHAPE;
  //   };
  data: string;
  driverData: string;
  config: { shape: GEOGRAPHY_SHAPE; srid: number };
}>({
  dataType(config) {
    const { shape, srid } = config ?? { shape: "POINT", srid: 4326 };
    logger.info(`DATA TYPE CONFIG: ${inspect(config)}`);
    return `geography(${shape?.toUpperCase()}, ${srid})`;
  },
  toDriver(value) {
    logger.info(`TO DRIVER VALUE: ${value}`);
    // const {
    //   coordinates: { lat, lng },
    // } = value;
    // const srid = value.srid ?? 4326;
    // const shape = value.shape?.toUpperCase() ?? "POINT";

    // return `ST_MakePoint(${lng}, ${lat})`;

    // return `SRID=${srid};${shape}(${lng} ${lat})`;

    return value;
  },
  fromDriver(value) {
    logger.info(`FROM DRIVER VALUE: ${value}`);
    // const ewktGeographyRepresentation = value.split(";");
    // const [srid, shapeString] = ewktGeographyRepresentation;
    // const shape = shapeString.split("(")[0];
    // const match = shapeString.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);

    // if (!match) {
    //   throw new Error(`Invalid POINT value: ${shapeString}`);
    // }

    // const lng = Number(match[1]);
    // const lat = Number(match[2]);

    // return {
    //   coordinates: { lat, lng },
    //   srid: Number(srid ?? 4326),
    //   shape: (shape ?? "POINT") as GEOGRAPHY_SHAPE,
    // };

    return value;
  },
});
