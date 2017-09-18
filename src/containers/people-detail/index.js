import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  NavigatorIOS,
  ScrollView,
  refreshControl,
  RefreshControl,
  Navigator,
  Button,
  TouchableOpacity,
  TextInput
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPeopleById } from '../../actions/people'
import { getPeopleById } from '../../reducers/people'
import { ListItem } from '../../components/ui'
import FollowButton from '../../components/follow-button'

class PeopleDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: params.title
      // headerRight: (<View><Button onPress={()=>params.submit()} title={"关注"} /></View>),
    }

  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    // console.log(this);
    const { id } = this.props.navigation.state.params

    const { loadPeopleById } = this.props
    const [ people ] = this.props.people

    if (!people) {
      loadPeopleById({
        id
      })
    }

  }

  render() {

    const [ people ] = this.props.people

      const { navigate } = this.props.navigation


    if (!people) {
      return (<View>
        <Text>Loading...</Text>
      </View>)
    }

    return (<ScrollView>
      <View style={styles.head}>
        <View>
          {people.avatar_url ? <Image source={{uri:'https:'+people.avatar_url}} style={styles.avatar}  /> : null}
        </View>
        <View>
          {people.nickname ? <Text style={styles.nickname}>{people.nickname}</Text> : null}
          <View style={styles.other}>
            {people.fans_count ? <Text style={styles.fans}>{people.fans_count} 粉丝</Text> : null}
            {people.follow_people_count ? <Text>{people.follow_people_count} 关注</Text> : null}
          </View>
          <FollowButton people_id={people._id} follow={people.follow} />
        </View>
      </View>

      <View style={styles.brief}>
        {people.brief ? <Text>{people.brief}</Text> : null}
      </View>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'PostsList', id: people._id, filters: { user_id: people._id }, title: people.nickname + '的帖子' }) }}>
        <ListItem name={"他发布的帖子"} rightText={people.posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'CommentList', id: people._id, filters: { user_id: people._id, sort: -1, include_reply: -1 }, title: people.nickname + '的评论' }) }}>
        <ListItem name={"他的评论"} rightText={people.comment_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'TopicList', id: people._id, filters: { people_id: people._id, child:1 }, title: people.nickname + '关注的话题' }) }}>
        <ListItem name={"他的关注的话题"} rightText={people.follow_topic_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPosts', id: people._id + '-posts', filters: { user_id: people._id, posts_exsits: 1 }, title: people.nickname + '关注的帖子' }) }}>
        <ListItem name={"他关注的帖子"} rightText={people.follow_posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: people._id + '-follow', filters: { user_id: people._id, people_exsits: 1 }, title: people.nickname + '关注的人' }) }}>
        <ListItem name={"他关注的人"} rightText={people.follow_people_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{ navigate('List', { componentName: 'FollowPeopleList', id: people._id + '-fans', filters: { people_id: people._id, people_exsits: 1 }, title: people.nickname + '的粉丝' }) }}>
        <ListItem name={"他的粉丝"} rightText={people.fans_count} />
      </TouchableOpacity>

    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  head: {
    padding:20,
    // marginBottom:10,
    backgroundColor: '#fff',
    flexDirection: 'row'
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20
  },
  brief: {
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  other: {
    flexDirection: 'row',
    marginBottom: 10
  },
  nickname: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  fans: {
    marginRight: 10
  }
})

export default connect((state, props) => ({
    people: getPeopleById(state, props.navigation.state.params.id)
  }),
  (dispatch) => ({
    loadPeopleById: bindActionCreators(loadPeopleById, dispatch)
  })
)(PeopleDetail);
