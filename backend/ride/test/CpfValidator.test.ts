import CpfValidator from "../src/CpfValidator";

test.each([
  "95818705552",
  "01234567890",
  "565.486.780-60",
  "147.864.110-00",
  "081.438.020-43",
  "002.580.820-62",
])("Deve validar um cpf", function (cpf: string) {
  const cpfValidator = new CpfValidator();
  expect(cpfValidator.validate(cpf)).toBeTruthy();
});

test.each(["958.187.055-00", "958.187.055"])(
  "Não deve validar um cpf",
  function (cpf: string) {
    const cpfValidator = new CpfValidator();
    expect(cpfValidator.validate(cpf)).toBeFalsy();
  }
);
