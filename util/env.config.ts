export const envConfig = {
  HOST: process.env.HOST!,
  LISTEN_HOST: process.env.LISTEN_HOST!,
  PORT: process.env.PORT!,
  PROTOCOL: process.env.PROTOCOL!,
  CORS_ORIGIN: process.env.CORS_ORIGIN!,
  SERVER_ROOT: process.env.SERVER_ROOT!,
  ASYMMETRIC_PUBLIC_KEY: process.env.ASYMMETRIC_PUBLIC_KEY!,
  JWT_VERIFY_ALG: process.env.JWT_VERIFY_ALG!,
  JWT_VERIFY_SUB: process.env.JWT_VERIFY_SUB!,
  JWT_VERIFY_ISS: process.env.JWT_VERIFY_ISS!,
  JWT_VERIFY_AUD: process.env.JWT_VERIFY_AUD!,
};
