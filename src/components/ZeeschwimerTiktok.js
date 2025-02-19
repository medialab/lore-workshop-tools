import React, { useState } from 'react'
import DropZone from './DropZone';
import { downloadTextfile } from '../helpers';
import { JSONArrayToCSVStr } from '../helpers';


const getChannelURLFromPlatform = (platform, channel) => {
  switch (platform) {
    case 'tiktok':
      return `https://www.tiktok.com/@${channel}`;
    case 'instagram':
      return `https://www.instagram.com/${channel}`;
    case 'twitch':
      return `https://www.twitch.tv/${channel}`;
    case 'youtube':
    default:
      return `https://www.youtube.com/@${channel}`;
  }
}

const zeeschwimmerToContentCards = ndjson => {
  const json = "[" + ndjson.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
  
  const processed = JSON.parse(json).map(({data}) => {
    return {
      platform: 'tiktok',
      title: data.desc,
      channel: data.author.nickname,
      channelName: data.author.uniqueId,
      url: `https://www.tiktok.com/@${data.author.uniqueId}/video/${data.id}`,
      type: 'content'
    }
  });
  const channels = new Map();

  processed.forEach(card => {
    const { channel, platform } = card;
    if (channel && !channels.get(channel)) {
      const url = getChannelURLFromPlatform(platform, channel)
      channels.set(channel, { channel, platform, url, type: 'channel' })
    }
  })
  return [...processed, ...Array.from(channels).map(c => c[1])];
  /*
  const browseEvents = events.filter(({ type }) => type === 'BROWSE_VIEW');
  console.log(browseEvents)
  const processed = browseEvents.map(event => {
    const { platform, url } = event;
    const title = event['metadata.title'] || event.title;
    const channelName = event['metadata.channelName'] || event['metadata.channelId'] || event.channelId;
    const channel = event['metadata.channelId'] || event.channelId;

    return {
      platform,
      title,
      channel,
      channelName,
      url,
      type: 'content'
    }
  }).filter(c => c.channel || c.title);
  const channels = new Map();

  processed.forEach(card => {
    const { channel, platform } = card;
    if (channel && !channels.get(channel)) {
      const url = getChannelURLFromPlatform(platform, channel)
      channels.set(channel, { channel, platform, url, type: 'channel' })
    }
  })
  return [...processed, ...Array.from(channels).map(c => c[1])];
  */
}

const ZeeschwimerTiktok = ({
  width, height
}) => {
  const [cardsData, setCardsData] = useState();
  return (
    <div className="selfie-dump-to-cards">
      {
        cardsData ?
          <div className="cards-space-wrapper">
            <ul className="cards-actions">
              <li>
                <button onClick={() => window.print()}>imprimer</button>
              </li>
              <li>
                <button
                  onClick={() => {
                    downloadTextfile(
                      JSONArrayToCSVStr(cardsData),
                      `lore-workshop-cards-${new Date().toUTCString()}.csv`,
                      'text/csv'
                    )
                  }}
                >télécharger en tableau (csv)</button>
              </li>
              <li>
                <button onClick={() => setCardsData()}>réinitialiser</button>
              </li>
            </ul>
            <ul className="cards-container">
              {
                cardsData.map((card, cardIndex) => {
                  const { type, platform, url, title, channel, channelName } = card;
                  const cardTitle = type === 'content' ? title || channelName : channelName || channel;
                  const typeLabel = type === 'content' ? 'contenu' : 'chaîne';
                  return (
                    <li
                      key={cardIndex}
                      className={`Card ${type}`}
                    >
                      <h3 className="metadata">{typeLabel} {platform}</h3>
                      <h2 className="title">{cardTitle.split('\n')[0]}</h2>
                      {type === 'content' && (channelName || channel) !== cardTitle ? <h3 className="channel">{channelName || channel}</h3> : ''}
                      <h4 className="url"><a target="blank" href={url}>{url}</a></h4>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          :
          <div className="import-wrapper">
            <h2>Générateur de cartes à partir de tiktok</h2>
            <ul>
              <li>Rendez-vous sur la page des <a href="https://wiki.digitalmethods.net/Dmi/ToolDatabase">outils DMI</a> et installer l'extension Zeeschwimmer (avant-dernière)</li>
              <li>Une fois installé, cliquer sur l'icône de l'extension et activer "Tiktok (posts)" dans la liste</li>
              <li>Naviguer sur tiktok pour récupérer les posts qui vous intéressent</li>
              <li>Revenor dans l'onglet de l'extension et cliquer sur le bouton ".ndjson"</li>
              <li>Revener ici et déposer le fichier</li>
              <li>Revener ici et déposer le fichier</li>
            </ul>
            <p>
              ...ou bien utiliser l'un des scripts ci-contre pour récupérer des données via une autre plateforme
            </p>
            <p>
              Puis :
            </p>
            <DropZone
              acceptedExtensions={'ndjson'}
              onUpload={(str) => {
                const processData = zeeschwimmerToContentCards(str)
                setCardsData(processData)
              }}
            />
          </div>
      }

    </div>
  )
}

export default ZeeschwimerTiktok;