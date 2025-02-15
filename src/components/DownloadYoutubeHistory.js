
import copy from 'copy-to-clipboard';
import Highlight from 'react-highlight';
import '../../node_modules/highlight.js/scss/darcula.scss';

const snippet = `

function downloadArrayAsCsv(array, filename = 'youtube-history-as-selfie.csv') {
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

const formattedData = Array.from(document.querySelectorAll('ytd-video-renderer')).map(el => {
  const title = el.querySelector('#video-title')?.getAttribute('title');
  const href = el.querySelector('#video-title')?.getAttribute('href')?.split('&')[0];

  const channelHref = el.querySelector('.ytd-channel-name a');
  return {
    title,
    url: 'https://www.youtube.com' + href,
    channelId: channelHref.getAttribute('href').substr(2),
    channelName: channelHref.innerText.trim(),
    platform: 'youtube',
    type: 'BROWSE_VIEW'
  }
})

downloadArrayAsCsv(formattedData);
`

const DownloadYoutubeHistory = () => {
  return (
    <div className="DownloadYoutubeHistory">
      <h1>Télécharger votre historique de visionnage youtube au format carte lore-selfie</h1>
      <ul className="tuto">
        <li>
          Depuis votre navigateur, rendez-vous sur la page de votre historique youtube : <a href="https://www.youtube.com/feed/history">https://www.youtube.com/feed/history</a>
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

export default DownloadYoutubeHistory;