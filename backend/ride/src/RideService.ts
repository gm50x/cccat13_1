import crypto from "crypto";
import pgp from "pg-promise";
import AccountService from "./AccountService";

export default class RideService {
  constructor(private readonly accountService = new AccountService()) {}

  private async getActiveRidesByPassenger(passengerId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
      return connection.query(
        "select * from cccat13.ride where passenger_id=$1 and status!=$2",
        [passengerId, "completed"]
      );
    } finally {
      await connection.$pool.end();
    }
  }

  async getRide(rideId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    try {
      const [ride] = await connection.query(
        "select * from cccat13.ride where ride_id=$1",
        [rideId]
      );
      return ride;
    } finally {
      await connection.$pool.end();
    }
  }
  async requestRide(
    passengerId: string,
    from: { lat: number; long: number },
    to: { lat: number; long: number }
  ) {
    const account = await this.accountService.getAccount(passengerId);

    if (!account.is_passenger) {
      throw new Error("Account is not a passenger");
    }

    const activeRides = await this.getActiveRidesByPassenger(passengerId);
    if (activeRides.length) {
      throw new Error("Passenger already has a ride in progress");
    }

    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    try {
      const rideId = crypto.randomUUID();
      const rideDate = new Date();
      const status = "requested";

      connection.query(
        "insert into cccat13.ride (ride_id, passenger_id, date, from_lat, from_long, to_lat, to_long, status) values ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          rideId,
          passengerId,
          rideDate,
          from.lat,
          from.long,
          to.lat,
          to.long,
          status,
        ]
      );

      return { ride_id: rideId };
    } finally {
      await connection.$pool.end();
    }
  }
}
