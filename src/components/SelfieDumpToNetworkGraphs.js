import React, { useState } from 'react'
import DropZone from './DropZone';
import Graph from "graphology"
import forceAtlas2 from "graphology-layout-forceatlas2"
import gexf from 'graphology-gexf/browser';
import { downloadTextfile } from '../helpers';


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

const buildNetworkGraph = (events, linkKeys = []) => {
  const graph = new Graph()
  events.forEach((event, index) => {
    graph.addNode(`event-${event.id}`, {
      x: Math.random() * 1000,
      y: Math.random() * 1000, // index,
      size: 1,// channel.urlsCount,
      label: `${event.title}`,
      channel: event.channel,
      metadata: {
        channelName: event.channel
      }
      // color: legend.channel.color
    })
  })
  events.forEach((event1, index1) => {
    events.slice(index1 + 1).forEach((event2) => {
      const relates = linkKeys.some(key => event1[key] === event2[key]);
      if (relates) {
        // const linkId = `from-${event1.id}-to${event2.id}`;
        if (graph.hasEdge(`event-${event1.id}`, `event-${event2.id}`)) {
          // console.log('ok', event1, event2)
          graph.updateEdgeAttribute(`event-${event1.id}`, `event-${event2.id}`, 'weight', w => w + 1)
        } else {
          // console.log('add edge', event1.title, event2.title);
          graph.addEdge(`event-${event1.id}`, `event-${event2.id}`, {weight: 1})
        }
      }
    })
  })
  // const sensibleSettings = forceAtlas2.inferSettings(graph)

  //   forceAtlas2.assign(graph, {
  //     iterations: 50,
  //     settings: {
  //       ...sensibleSettings,
  //       gravity: 10
  //     }
  //     // settings: {
  //     //   gravity: 10
  //     // }
  //   })
  return graph;
}

const historyToNetworks = ({activities}) => {
  console.log(activities);
  const events = activities;
  ;
  const browseEvents = events.filter(({ type }) => type === 'BROWSE_VIEW');
  console.log(browseEvents);
  const processed = browseEvents.map(event => {
    const { platform, url, metadata, date, id } = event;
    const dateParsed = new Date(date);
    const dayOfWeek = dateParsed.getDay();
    const hourOfDay = dateParsed.getHours();
    const title = metadata.title || event.title;
    const channelName = metadata.channelName || metadata.channelId;
    const channel = metadata.channelId || event.channelId;

    return {
      id,
      platform,
      title,
      channel,
      channelName,
      url,
      type: 'content',
      date,
      dayOfWeek,
      hourOfDay,
      hourOfDaySlice3h: hourOfDay - hourOfDay%3,
      hourOfDaySlice6h: hourOfDay - hourOfDay%6
    }
  }).filter(c => c.channel || c.title);
  // console.log(processed);
  const networks = [
    {
      keys: ['dayOfWeek'],

    },
    {
      keys: ['hourOfDay'],

    },
    {
      keys: ['channel'],
    },  
    {
      keys: ['hourOfDaySlice3h'],

    },
    {
      keys: ['hourOfDaySlice6h'],

    },
    {
      keys: ['channel', 'hourOfDaySlice3h', 'dayOfWeek']
    }
  ]
  networks.forEach(({keys}) => {
    const graph = buildNetworkGraph(processed, keys);
    const fileName = `lore-selfie-graph-keys-${keys.join('_')}.gexf`;
    const gexfString = gexf.write(graph);
    downloadTextfile(
      gexfString,
      fileName,
      'text/xml'
    )
  })
  
  return;
  // return [...processed, ...Array.from(channels).map(c => c[1])];
}

const SelfieDumpToNetworkGraphs = ({
  width, height
}) => {
  const [cardsData, setCardsData] = useState();
  return (
    <div className="selfie-dump-to-cards">
      {
        cardsData ?
          <div className="cards-space-wrapper">
            <ul className="cards-actions">
              {/* <li>
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
              </li> */}
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
            <h2>Générateur de cartes d'historique à imprimer</h2>
            <ul>
              <li>Ouvrir lore selfie</li>
              <li>Cliquer sur "sauvegarder les données"</li>
            </ul>
            <p>
              ...ou bien utiliser l'un des scripts ci-contre pour récupérer des données via une autre plateforme
            </p>
            <p>
              Puis :
            </p>
            <DropZone
              acceptedExtensions={'json'}
              onUpload={(str) => {
                // console.log(str);
                const data = JSON.parse(str);
                historyToNetworks(data);
                // const inputs = csvParse(str);
                // const processData = historyToContentCards(inputs)
                // setCardsData(processData)
              }}
            />
          </div>
      }
    </div>
  )
}

export default SelfieDumpToNetworkGraphs;