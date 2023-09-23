import axios from "axios";
describe("API Driver", () => {
  it("Deve criar uma conta de passageiro", async () => {
    const signpuInput = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    };
    const signupResponse = await axios.post(
      `http://localhost:3000/signup`,
      signpuInput
    );
    const signupOutput = signupResponse.data;
    const getAccountResponse = await axios.get(
      `http://localhost:3000/accounts/${signupOutput.accountId}`
    );
    const getAccountOutput = getAccountResponse.data;
    expect(getAccountOutput.account_id).toBeDefined();
    expect(getAccountOutput.name).toBe(signpuInput.name);
    expect(getAccountOutput.email).toBe(signpuInput.email);
    expect(getAccountOutput.cpf).toBe(signpuInput.cpf);
    expect(getAccountOutput.is_passenger).toBeTruthy();
  });
  it("Deve criar uma conta de motorista", async () => {
    const signpuInput = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isDriver: true,
      carPlate: "YYY9999",
    };
    const signupResponse = await axios.post(
      `http://localhost:3000/signup`,
      signpuInput
    );
    const signupOutput = signupResponse.data;
    const getAccountResponse = await axios.get(
      `http://localhost:3000/accounts/${signupOutput.accountId}`
    );
    const getAccountOutput = getAccountResponse.data;
    expect(getAccountOutput.account_id).toBeDefined();
    expect(getAccountOutput.name).toBe(signpuInput.name);
    expect(getAccountOutput.email).toBe(signpuInput.email);
    expect(getAccountOutput.cpf).toBe(signpuInput.cpf);
    expect(getAccountOutput.car_plate).toBe(signpuInput.carPlate);
    expect(getAccountOutput.is_driver).toBeTruthy();
  });
});
