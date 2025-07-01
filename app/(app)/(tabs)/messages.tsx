import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS, globalStyles } from '@/constants/Theme';
import { Search, Plus, Send, ChevronLeft, MoveVertical as MoreVertical, Paperclip, Image as ImageIcon, FileText, MessageSquare, Megaphone } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface MessageUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  attachment?: {
    type: 'image' | 'document';
    url: string;
    name?: string;
  };
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<MessageUser | null>(null);
  const [message, setMessage] = useState('');
  
  // Mock data for recent messages
  const recentMessages: MessageUser[] = [
    {
      id: '1',
      name: 'Mrs. Sarah Wilson',
      role: 'Math Teacher',
      avatar: 'https://images.pexels.com/photos/3783525/pexels-photo-3783525.jpeg?auto=compress&cs=tinysrgb&w=600',
      lastMessage: 'Don\'t forget to submit your homework by Friday',
      time: '10:30 AM',
      unread: 1,
    },
    {
      id: '2',
      name: 'Mr. James Brown',
      role: 'Science Teacher',
      avatar: 'https://images.pexels.com/photos/5212665/pexels-photo-5212665.jpeg?auto=compress&cs=tinysrgb&w=600',
      lastMessage: 'Great work on your project presentation',
      time: 'Yesterday',
      unread: 0,
    },
    {
      id: '3',
      name: 'Principal Davis',
      role: 'School Principal',
      avatar: 'https://images.pexels.com/photos/678783/pexels-photo-678783.jpeg?auto=compress&cs=tinysrgb&w=600',
      lastMessage: 'Reminder: Parent-teacher meeting next week',
      time: 'Mon',
      unread: 2,
    },
  ];
  
  // Mock conversation data
  const conversations: Record<string, Message[]> = {
    '1': [
      {
        id: 'm1',
        senderId: '1',
        text: 'Hello Siddh, I wanted to remind you about the math homework that\'s due this Friday.',
        time: '10:15 AM',
        read: true,
      },
      {
        id: 'm2',
        senderId: '1',
        text: 'Please make sure to complete all the exercises on pages 45-46.',
        time: '10:20 AM',
        read: true,
      },
      {
        id: 'm3',
        senderId: user?.id || '',
        text: 'Thank you Mrs. Wilson! I\'ve almost finished it. Just have a few questions on problem #5.',
        time: '10:25 AM',
        read: true,
      },
      {
        id: 'm4',
        senderId: '1',
        text: 'Feel free to ask your questions here or come see me after class tomorrow.',
        time: '10:30 AM',
        read: false,
      },
    ],
    '2': [
      {
        id: 'm1',
        senderId: '2',
        text: 'Siddh, I wanted to let you know that your science project presentation was excellent.',
        time: 'Yesterday',
        read: true,
      },
      {
        id: 'm2',
        senderId: user?.id || '',
        text: 'Thank you Mr. Brown! I worked really hard on it.',
        time: 'Yesterday',
        read: true,
      },
      {
        id: 'm3',
        senderId: '2',
        text: 'It showed. Your research on renewable energy was thorough and your presentation was clear.',
        time: 'Yesterday',
        read: true,
        attachment: {
          type: 'document',
          url: 'https://example.com/feedback.pdf',
          name: 'project_feedback.pdf',
        },
      },
    ],
    '3': [
      {
        id: 'm1',
        senderId: '3',
        text: 'Dear Students and Parents,',
        time: 'Mon',
        read: true,
      },
      {
        id: 'm2',
        senderId: '3',
        text: 'This is a reminder that we have scheduled the parent-teacher meeting for next week, on Thursday from 4-7 PM.',
        time: 'Mon',
        read: true,
      },
      {
        id: 'm3',
        senderId: '3',
        text: 'Please make arrangements to attend as this is an important opportunity to discuss student progress.',
        time: 'Mon',
        read: false,
      },
      {
        id: 'm4',
        senderId: '3',
        text: 'You can book your preferred time slot through the school portal.',
        time: 'Mon',
        read: false,
        attachment: {
          type: 'image',
          url: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=600',
        },
      },
    ],
  };
  
  const filteredMessages = searchQuery
    ? recentMessages.filter(msg => 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentMessages;
  
  const handleSelectChat = (chat: MessageUser) => {
    setSelectedChat(chat);
  };
  
  const handleBackToList = () => {
    setSelectedChat(null);
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    // In a real app, this would send the message to a backend
    // For this demo, we'll just clear the input
    setMessage('');
  };

  const handleNewMessage = () => {
    if (user?.role === 'teacher') {
      router.push('/(app)/send-message');
    } else if (user?.role === 'admin') {
      router.push('/(app)/broadcast-message');
    } else {
      // Students can only reply to existing conversations
      return;
    }
  };

  const getNewMessageIcon = () => {
    if (user?.role === 'admin') {
      return <Megaphone size={24} color={Colors.primary[600]} />;
    }
    return <MessageSquare size={24} color={Colors.primary[600]} />;
  };

  const getNewMessageText = () => {
    if (user?.role === 'teacher') return 'Send to Class';
    if (user?.role === 'admin') return 'Broadcast';
    return 'New Message';
  };
  
  const renderItem = ({ item }: { item: MessageUser }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => handleSelectChat(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        
        <View style={styles.chatPreview}>
          <Text style={styles.chatRole}>{item.role}</Text>
          <Text 
            numberOfLines={1} 
            style={[
              styles.chatLastMessage,
              item.unread > 0 && styles.unreadMessage
            ]}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderChatBubble = (message: Message) => {
    const isUserMessage = message.senderId === user?.id;
    
    return (
      <View 
        style={[
          styles.messageBubbleContainer,
          isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer
        ]}
      >
        {message.attachment && (
          <View style={styles.attachmentContainer}>
            {message.attachment.type === 'image' ? (
              <Image 
                source={{ uri: message.attachment.url }} 
                style={styles.attachmentImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.documentContainer}>
                <FileText size={24} color={Colors.primary[600]} />
                <Text style={styles.documentName}>{message.attachment.name}</Text>
              </View>
            )}
          </View>
        )}
        
        <View 
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userMessage : styles.otherMessage
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              isUserMessage ? styles.userMessageText : styles.otherMessageText
            ]}
          >
            {message.text}
          </Text>
        </View>
        
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{message.time}</Text>
          {isUserMessage && (
            <View 
              style={[
                styles.readStatus,
                message.read ? styles.readStatusRead : styles.readStatusUnread
              ]}
            />
          )}
        </View>
      </View>
    );
  };

  // Render chat list or conversation
  if (selectedChat) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToList}
            >
              <ChevronLeft size={24} color={Colors.neutral[800]} />
            </TouchableOpacity>
            
            <Image source={{ uri: selectedChat.avatar }} style={styles.chatHeaderAvatar} />
            
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
              <Text style={styles.chatHeaderStatus}>Online</Text>
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={24} color={Colors.neutral[800]} />
            </TouchableOpacity>
          </View>
          
          <Animated.FlatList
            entering={FadeIn.duration(300)}
            data={conversations[selectedChat.id]}
            renderItem={({ item }) => renderChatBubble(item)}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            inverted={false}
          />
          
          {user?.role === 'student' && (
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={24} color={Colors.neutral[600]} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} color={message.trim() ? Colors.white : Colors.neutral[400]} />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={Colors.neutral[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
          
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <TouchableOpacity 
              style={styles.newMessageButton}
              onPress={handleNewMessage}
            >
              {getNewMessageIcon()}
            </TouchableOpacity>
          )}
        </View>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              {user?.role === 'teacher' && (
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/(app)/send-message')}
                >
                  <MessageSquare size={20} color={Colors.primary[600]} />
                  <Text style={styles.quickActionText}>Send to Class</Text>
                </TouchableOpacity>
              )}
              
              {user?.role === 'admin' && (
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => router.push('/(app)/broadcast-message')}
                >
                  <Megaphone size={20} color={Colors.error[600]} />
                  <Text style={styles.quickActionText}>School Broadcast</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        <FlatList
          data={filteredMessages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: FONT_SIZE.xl,
    color: Colors.neutral[900],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.sm,
    color: Colors.neutral[900],
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  quickActionsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginBottom: SPACING.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[700],
    marginLeft: SPACING.xs,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
  },
  chatItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  chatName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  chatTime: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[500],
  },
  chatPreview: {
    flexDirection: 'column',
  },
  chatRole: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.neutral[600],
    marginBottom: 2,
  },
  chatLastMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[600],
    flex: 1,
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[800],
  },
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: '50%',
    backgroundColor: Colors.primary[600],
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.white,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[500],
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  chatHeaderName: {
    fontFamily: 'Inter-Medium',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  chatHeaderStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.xs,
    color: Colors.success[600],
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  messageBubbleContainer: {
    maxWidth: '80%',
    marginBottom: SPACING.md,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  userMessage: {
    backgroundColor: Colors.primary[100],
  },
  otherMessage: {
    backgroundColor: Colors.neutral[100],
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
  },
  userMessageText: {
    color: Colors.primary[900],
  },
  otherMessageText: {
    color: Colors.neutral[900],
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.neutral[600],
    marginRight: 4,
  },
  readStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  readStatusRead: {
    backgroundColor: Colors.success[500],
  },
  readStatusUnread: {
    backgroundColor: Colors.neutral[400],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Colors.white,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.md,
    color: Colors.neutral[900],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  attachmentContainer: {
    marginBottom: SPACING.xs,
  },
  attachmentImage: {
    width: '100%',
    height: 150,
    borderRadius: BORDER_RADIUS.md,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  documentName: {
    fontFamily: 'Inter-Regular',
    fontSize: FONT_SIZE.sm,
    color: Colors.neutral[800],
    marginLeft: SPACING.sm,
    flex: 1,
  },
});