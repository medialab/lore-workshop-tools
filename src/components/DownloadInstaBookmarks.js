
import copy from 'copy-to-clipboard';
import Highlight from 'react-highlight';
import '../../node_modules/highlight.js/scss/darcula.scss';

const snippet = `
function downloadArrayAsCsv(array, filename = 'bookmarks-insta-formatted-as-selfie.csv') {
  const headers = Object.keys(array[0]);
  const str = array.reduce((cur, row) =>
          \`\${cur}
\${headers.map(key => \`"\${row[key]?.replaceAll('"', '""')}"\`).join(',')}\`
          , headers.join(','));

  const blob = new Blob([str], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename; // Specify the file name
  document.body.appendChild(link); // Append the link to the document
  link.click(); // Programmatically click the link to trigger the download
  document.body.removeChild(link); // Clean up and remove the link
}

const rawItems = Array.from(document.querySelectorAll('a[role="link"]'))
  .map(el => {
    const url = \`https://www.instagram.com\${el.getAttribute('href')}\`;
    const alt = el.querySelector('img')?.getAttribute('alt');
    return { url, alt }
  }).filter(el => el.alt);

const goodData = [];
rawItems.reduce((cur, el, index) => {
  return cur
  .then((prev) => {
    console.info('%s/%s', index + 1, rawItems.length);
    return new Promise((resolve) => {
      const req = new XMLHttpRequest();
      req.open("GET", el.url);
      req.send();
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          const el = document.createElement('html');
          el.innerHTML = req.responseText;
          // const metatitle = el.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
          const url = el.querySelector('meta[property="og:url"]')?.getAttribute('content');
          const metadescription = el.querySelector('meta[name="description"]')?.getAttribute('content');
          const descriptionRegex = /.* - (\w+).*: "([\w\W]*)"/gm;
          const match = descriptionRegex.exec(metadescription);
          if (match) {
            const [_input, channelId, title] = match;
            const item = { channelId, title, url };
            goodData.push(item);
            return resolve([...prev, item]);
          } else {
            return resolve(prev);
          }
          
        } else {
          return resolve(prev)
        }
      };
    })
  })
}, Promise.resolve([]))
  .then(() => {
    const formattedData = goodData.map(d => ({
      ...d,
      platform: 'instagram',
      type: 'BROWSE_VIEW'
    }))
    console.log('final data = ', goodData);
    downloadArrayAsCsv(formattedData);
  })

`

const DownloadInstaBookmarks = () => {
  return (
    <div className="DownloadInstaBookmarks">
      <h1>Télécharger vos bookmarks instagram au format carte lore-selfie</h1>
      <ul className="tuto">
        <li>
          Depuis votre navigateur, rendez-vous sur la page de vos bookmarks instagram
        </li>
        <li>
          Ouvrez votre console de développement (<a href="https://support.monday.com/hc/fr/articles/360002197259-Comment-ouvrir-la-console-d%C3%A9veloppeur">tutoriel</a>)
        </li>
        <li>
          Copiez le code ci-dessous (<button onClick={() => copy(snippet)}>cliquez ici pour le copier directement dans le presse-papier</button>)
        </li>
        <li>
          coller le code dans l'invite de commande et appuyez sur entrée
        </li>
        <li>
          Revenez ici pour transformer votre fichier csv en cartes !
        </li>
      </ul>
      <Highlight className='js'>
        {snippet}
      </Highlight>
    </div>
  )
}

export default DownloadInstaBookmarks;