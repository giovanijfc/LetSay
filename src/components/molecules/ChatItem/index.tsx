import React, { memo, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';

import Text from '~/components/atoms/Text';

import COLORS from '~/utils/colors';
import SPACING from '~/utils/spacing';

import { UserPreviewChat } from '~/models/user';
import { LastMessagePreview } from '~/models/message';
import { Chat } from '~/models/chat';

import * as Styled from './styles';

interface Props {
  otherUser: UserPreviewChat;
  onPress(otherUser: UserPreviewChat, chat: Chat): void;
  lastMessage: LastMessagePreview;
  chat: Chat;
}

const ONE_MINUTES_IN_TIME_MILLIS = 60000;

let intervalCheckDateFormated: unknown = null;

const ChatItem: React.FC<Props> = ({
  otherUser,
  onPress,
  lastMessage,
  chat
}) => {
  const [date, setDate] = useState('');

  useLayoutEffect(() => {
    intervalCheckDateFormated = setInterval(() => {
      const dateFormated = getDateFormated();

      if (date !== dateFormated) {
        setDate(dateFormated);
      }
    }, 10000);

    return () => {
      clearInterval(intervalCheckDateFormated);
    };
  }, []);

  const getDateFormated = (): string => {
    const timeMillisNow = Date.now();
    const dateMessageTimeMillis = parseInt(lastMessage.date);
    const diferrence = timeMillisNow - dateMessageTimeMillis;

    if (!dateMessageTimeMillis) {
      return 'Agora...';
    }

    if (diferrence <= ONE_MINUTES_IN_TIME_MILLIS) {
      return 'Agora';
    }

    return moment(dateMessageTimeMillis).calendar();
  };

  return (
    <Styled.Container onPress={() => onPress(otherUser, chat)}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 100,
          backgroundColor: 'gray'
        }}
      />
      <Styled.AreaInfo>
        <Styled.WrapperHeaderInfo>
          <Text small semiBold color={COLORS.gray600}>
            {otherUser.username}
          </Text>
          <Text small color={COLORS.gray600}>
            {getDateFormated()}
          </Text>
        </Styled.WrapperHeaderInfo>

        <Text
          numberOfLines={1}
          style={{ marginTop: SPACING.default }}
          regular
          color='white'
        >
          {lastMessage.message}
        </Text>
      </Styled.AreaInfo>
    </Styled.Container>
  );
};

export default memo(ChatItem);
