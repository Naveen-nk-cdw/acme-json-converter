export interface EnvConfig {
  app: {
    port: number;
    env: string;
  };
}

const configuration = (): EnvConfig => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
});

export default configuration;
