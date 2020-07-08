import React, { useEffect, useState, useLayoutEffect } from 'react';
import auth from '@react-native-firebase/auth';
import RNdatabase, {
  FirebaseDatabaseTypes
} from '@react-native-firebase/database';

import Message from '~/components/atoms/Message';

import Header from './Header';
import Footer from './Footer';

import database from '~/services/firebase/database';

import { setStatusBar } from '~/utils/statusBar';
import COLORS from '~/utils/colors';

import { User } from '~/models/user';
import { Chat as ChatModel } from '~/models/chat';
import { Message as MessageModel } from '~/models/message';

import * as Styled from './styles';

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native-gesture-handler';
import CenterLoader from '~/components/atoms/CenterLoader';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
IconAntDesign.loadFont();

interface Props {
  route: Route;
}

interface Route {
  params: Params;
}

interface Params {
  otherUser: User;
  chat: ChatModel;
}

const Chat: React.FC<Props> = ({ route }) => {
  const [otherUser] = useState(route?.params?.otherUser);
  const [chat] = useState(route?.params?.chat);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    setStatusBar(COLORS.separator, true);

    return () => {
      RNdatabase().ref('/messages').off();
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void RNdatabase()
      .ref('/messages')
      .orderByChild('chatId')
      .equalTo(chat.id)
      .once('value', (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
        if (snapshot.val()) {
          setMessages(Object.values(snapshot.val()));
        }

        RNdatabase()
          .ref('/messages')
          .orderByChild('chatId')
          .equalTo(chat.id)
          .limitToLast(1)
          .on('child_added', (snapshot: FirebaseDatabaseTypes.DataSnapshot) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            setMessages(prevMessages => [...prevMessages, snapshot.val()])
          );
        setIsLoading(false);
      });

    return () => {
      RNdatabase().ref('/messages').off();
    };
  }, []);

  const onPressSendMessageHandler = async (
    textMessage: string,
    callbackFinish: unknown
  ) => {
    const userLoggedId = auth().currentUser?.uid;

    const message: MessageModel = {
      chatId: chat.id,
      message: textMessage,
      userId: userLoggedId || '',
      date: String(Date.now())
    };

    await database.message.createMessage(message);

    if (callbackFinish && typeof callbackFinish === 'function') {
      callbackFinish();
    }
  };

  const userLoggedId = auth().currentUser?.uid;

  return (
    <Styled.SafeAreaView>
      <Styled.Container>
        <Header name={otherUser.username} />

        {isLoading ? (
          <CenterLoader />
        ) : (
          <FlatList
            inverted
            showsVerticalScrollIndicator={false}
            data={messages}
            renderItem={({ item }) => (
              <Message
                message={item.message}
                from={item.userId === userLoggedId ? 'userLogged' : 'otherUser'}
              />
            )}
          />
        )}

        <Footer onPressSendMessage={onPressSendMessageHandler} />
      </Styled.Container>
    </Styled.SafeAreaView>
  );
};

export default Chat;
