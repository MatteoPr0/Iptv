const fs = require('fs');
const https = require('https');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  await download('https://placehold.co/192x192/4f46e5/ffffff.png?text=IPTV', 'public/icon-192.png');
  await download('https://placehold.co/512x512/4f46e5/ffffff.png?text=IPTV', 'public/icon-512.png');
  await download('https://placehold.co/1280x720/4f46e5/ffffff.png?text=Screenshot+1', 'public/screenshot-1.png');
  await download('https://placehold.co/720x1280/4f46e5/ffffff.png?text=Screenshot+2', 'public/screenshot-2.png');
  console.log('Done');
}

main();
