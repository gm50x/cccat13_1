import AccountService from "../src/AccountService";
import RideService from "../src/RideService";

describe("Ride Service", () => {
  describe("Passenger", () => {
    it("Deve solicitar uma corrida", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      expect(requestRideOutput.ride_id).toBeDefined();
    });

    it("Deve lançar um erro se a conta não for de passageiro", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isDriver: true,
        carPlate: "YYY9999",
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const rideService = new RideService();
      await expect(() =>
        rideService.requestRide(
          createPassengerOutput.accountId,
          { lat: 0, long: 0 },
          { lat: 10, long: 10 }
        )
      ).rejects.toThrowError(new Error("Not passenger account"));
    });
    it("Deve lançar um erro caso o passageiro possua outra corrida em andamento", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const rideService = new RideService();
      const from = { lat: 0, long: 0 };
      const to = { lat: 10, long: 10 };
      await rideService.requestRide(createPassengerOutput.accountId, from, to);
      await expect(() =>
        rideService.requestRide(createPassengerOutput.accountId, from, to)
      ).rejects.toThrowError(
        new Error("Passenger already has a ride in progress")
      );
    });
    it('Deve definir o status inicial da corrida como "requested"', async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const rideService = new RideService();
      const from = { lat: 0, long: 0 };
      const to = { lat: 10, long: 10 };
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        from,
        to
      );

      const ride = await rideService.getRide(requestRideOutput.ride_id);
      expect(ride.status).toBe("requested");
    });
    it("Deve definir a data da corrida como a data atual", async () => {
      const currentDate = new Date().toISOString().slice(0, 10);

      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const rideService = new RideService();
      const from = { lat: 0, long: 0 };
      const to = { lat: 10, long: 10 };
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        from,
        to
      );

      const ride = await rideService.getRide(requestRideOutput.ride_id);
      expect(ride.date.toISOString().slice(0, 10)).toBe(currentDate);
    });
  });

  describe("Driver", () => {
    it("Deve aceitar uma corrida e associar o driver_id", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const driverInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        carPlate: "AAA9999",
        isDriver: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const createDriverOutput = await accountService.signup(driverInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      await rideService.acceptRide(
        createDriverOutput.accountId,
        requestRideOutput.ride_id
      );
      const ride = await rideService.getRide(requestRideOutput.ride_id);
      expect(ride.driver_id).toBe(createDriverOutput.accountId);
    });
    it("Deve mudar o status da corrida para 'accepted'", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const driverInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        carPlate: "AAA9999",
        isDriver: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const createDriverOutput = await accountService.signup(driverInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      await rideService.acceptRide(
        createDriverOutput.accountId,
        requestRideOutput.ride_id
      );
      const ride = await rideService.getRide(requestRideOutput.ride_id);
      expect(ride.status).toBe("accepted");
    });
    it("Deve lançar um erro se a conta não for de motorista", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const driverInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const createDriverOutput = await accountService.signup(driverInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      await expect(() =>
        rideService.acceptRide(
          createDriverOutput.accountId,
          requestRideOutput.ride_id
        )
      ).rejects.toThrowError(new Error("Not driver account"));
    });
    it("Deve lançar um erro se a corrida não estiver com status 'requested'", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const driverInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        carPlate: "AAA9999",
        isDriver: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const createDriverOutput = await accountService.signup(driverInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      await rideService.acceptRide(
        createDriverOutput.accountId,
        requestRideOutput.ride_id
      );
      await expect(() =>
        rideService.acceptRide(
          createDriverOutput.accountId,
          requestRideOutput.ride_id
        )
      ).rejects.toThrowError(new Error("Ride cannot be accepted"));
    });
    it("Deve lançar um erro se o motorista já tiver outra corrida em andamento", async () => {
      const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const otherPassengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        isPassenger: true,
      };
      const driverInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "95818705552",
        carPlate: "AAA9999",
        isDriver: true,
      };
      const accountService = new AccountService();
      const createPassengerOutput = await accountService.signup(passengerInput);
      const createOtherPassengerOutput = await accountService.signup(
        otherPassengerInput
      );
      const createDriverOutput = await accountService.signup(driverInput);
      const rideService = new RideService();
      const requestRideOutput = await rideService.requestRide(
        createPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      const requestOtherRideOutput = await rideService.requestRide(
        createOtherPassengerOutput.accountId,
        { lat: 0, long: 0 },
        { lat: 10, long: 10 }
      );
      await rideService.acceptRide(
        createDriverOutput.accountId,
        requestRideOutput.ride_id
      );
      await expect(() =>
        rideService.acceptRide(
          createDriverOutput.accountId,
          requestOtherRideOutput.ride_id
        )
      ).rejects.toThrowError(
        new Error("Driver already has a ride in progress")
      );
    });
  });
});
