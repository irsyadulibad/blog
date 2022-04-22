require('dotenv').config({path: 'deploy/.env'});
const ftpDeploy = require('ftp-deploy');

const ftp = new ftpDeploy;

const env = name => {
    name = name.toUpperCase();
    return process.env[name];
}

const config = {
    user: env('ftp_username'),
    password: env('ftp_password'),
    host: env('ftp_host'),
    port: env('ftp_port'),
    localRoot: __dirname + '/../public',
    remoteRoot: '/',
    include: ["*", "**/*"],
    deleteRemote: true,
    sftp: false
}

ftp.deploy(config)
    .then(res => {
        console.log('Deploy succeeded')
    }).catch(err => {
        console.log(err)
    });
