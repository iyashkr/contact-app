import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Contacts from 'expo-contacts';

export default function Page() {
  const [phoneContacts, setphoneContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name,],
          sort: Contacts.SortTypes.FirstName
        });

        if (data.length > 0) {
          const filteredContacts = data.filter(
            (contact) =>
              contact.name !== null &&
              contact.phoneNumbers !== null &&
              contact.phoneNumbers?.length > 0
          );
          setphoneContacts(filteredContacts);
        }
      }
    })();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };


  const renderContact = ({ item, index }) => {
    const initials = item.name.charAt(0);
    const colors = ['#FFC107', '#FF5722', '#4CAF50', '#2196F3', '#9C27B0'];

    // Calculate the background color based on the index
    const colorIndex = index % colors.length;
    const backgroundColor = colors[colorIndex];

    const contactContainerStyle = {
      ...styles.initialsContainer,
      backgroundColor: backgroundColor,
    };
    return (
      <TouchableOpacity style={styles.contactContainer}>

        <View style={contactContainerStyle}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>

        <Text style={styles.contactName}>{item.name}</Text>
      </TouchableOpacity>
    )
  };
  const filteredContacts = phoneContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={{ marginTop: 30, textAlign: "center", color: "black", fontWeight: 600, fontSize: 24 }}>Contacts</Text>
        <View style={{ marginTop: 20, position: "relative", paddingHorizontal: 12, marginBottom: 20 }}>
          <TextInput style={{ backgroundColor: "#e8e9eb", height: 45, width: "100%", borderRadius: 80, paddingHorizontal: 24 }} placeholder="Search by name" value={searchQuery} onChangeText={handleSearch} />
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contactList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
  },
  contactList: {
    paddingHorizontal: 16,
  },
  contactContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
});