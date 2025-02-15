import React, { useCallback, useState } from 'react'
import DropZone from './DropZone';
import { csvParse } from 'd3-dsv';
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

const historyToContentCards = events => {
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
}

const SelfieDumpToCards = ({
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
                      <h4 className="url"><a href={url}>{url}</a></h4>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          :
          <div className="import-wrapper">
            <h2>Commencez par récupérer vos données !</h2>
            <ul>
              <li>Ouvrir lore selfie</li>
              <li>Aller dans exporter</li>
              <li>Mettre en place les paramètres d'exports à votre guise (dates, anonymisation)</li>
              <li>Cliquer sur "télécharger au csv"</li>
            </ul>
            <p>
              ...ou bien utiliser l'un des scripts ci-contre pour récupérer des données via une autre plateforme
            </p>
            <p>
              Puis :
            </p>
            <DropZone
              onUpload={(str) => {
                const inputs = csvParse(str);
                const processData = historyToContentCards(inputs)
                setCardsData(processData)
              }}
            />
          </div>
      }

    </div>
  )
}

export default SelfieDumpToCards;