import AccountService from "../src/AccountService";
import RideService from "../src/RideService";

test("Deve solicitar uma corrida", async () => {
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

test("Deve lançar um erro se a conta não for de passageiro", async () => {
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
  ).rejects.toThrowError(new Error("Account is not a passenger"));
});
test("Deve lançar um erro caso o passageiro possua outra corrida em andamento", async () => {
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
  ).rejects.toThrowError(new Error("Passenger already has a ride in progress"));
});
test('Deve definir o status inicial da corrida como "requested"', async () => {
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
test("Deve definir a data da corrida como a data atual", async () => {
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
