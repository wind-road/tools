module.exports = {
  apps: [
    {
      name: 'tools',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3203,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3203,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3203,
      },
      // 日志配置
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // 自动重启配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      // 其他配置
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
    {
      name: 'tools-dev',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      // 日志配置
      error_file: './logs/pm2-dev-error.log',
      out_file: './logs/pm2-dev-out.log',
      log_file: './logs/pm2-dev-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // 开发环境自动重启配置
      autorestart: true,
      watch: true,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.git',
        '*.log',
      ],
      max_memory_restart: '1G',

      // 其他配置
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
