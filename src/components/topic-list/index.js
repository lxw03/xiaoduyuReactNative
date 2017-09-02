
import React, { Component } from 'react';
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
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { Toast } from 'teaset'

import { loadTopicList, followTopic, unfollowTopic } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

class TopicList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.toTopic = this.toTopic.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
  }

  toTopic(topic) {
    const { navigate } = this.props.navigation;

    navigate('TopicDetail', { title: topic.name, id: topic._id })
  }

  componentDidMount() {

    const self = this
    const { topicList } = this.props

    if (!topicList.data) {
      this.loadPostsList(()=>{
        // self.setState({})
      })
    }

  }

  loadPostsList(callback, restart) {

    const { id, filters } = this.props

    this.props.loadTopicList({
      name:id,
      filters,
      callback,
      restart
    })
  }

  renderHeader() {
    return (
      <View>
        <Text>我是列表头部</Text>
      </View>
    )
  }

  renderFooter() {

    const { topicList } = this.props

    if (topicList.loading) {
      return (
        <View>
          <Text>加载中</Text>
        </View>
      )
    }
    return (
      <View>
        <Text>没有更多了</Text>
      </View>
    )
  }

  handleFollow(topic) {
    const { followTopic, unfollowTopic } = this.props

    let fn = topic.follow ? unfollowTopic : followTopic

    fn({
      id: topic._id,
      callback: (res)=>{
        if (res && res.success) {
          // Toast.show({
          //   text: topic.follow ? '关注成功' : '已取消关注',
          //   icon: 'success',
          //   position: 'center',
          //   duration: 2000
          // })
        }
      }
    })

  }

  render() {

    const { topicList } = this.props

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(topicList.data || [])

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<TouchableOpacity onPress={()=>{this.toTopic(topic)}}>
            <View style={styles.item}>
              <View style={styles.itemLeft}><Image source={{uri:'https:'+topic.avatar}} style={styles.avatar} /></View>
              <View style={styles.itemCenter}><Text>{topic.name}</Text><Text style={styles.brief}>{topic.brief}</Text></View>
              <View style={styles.itemRight}>
                <TouchableOpacity style={[styles.followButton, (!topic.follow ? null : styles.gary) ]} onPress={()=>this.handleFollow(topic)}>
                  <Text style={[styles.followButtonText, (!topic.follow ? null : styles.garyText) ]}>{topic.follow ? '已关注' : '关注'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>)}
          scrollEventThrottle={50}
          removeClippedSubviews={false}
        />
      </View>
    )
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  _onScroll(event) {
    const self = this
    if (this.state.loadMore) return
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    // console.log('offsetY-->' + y);
    // console.log('height-->' + height);
    // console.log('contentHeight-->' + contentHeight);
    if (y+height>=contentHeight-20) {
      self.loadPostsList()
    }
  }

  _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    self.loadPostsList(()=>{
      self.setState({ isRefreshing: false })
    }, true)
  }

}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  item: {
    backgroundColor: '#fff',
    padding:15,
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  itemLeft: {
    width:50
  },
  itemCenter: {
    flex:1
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },
  itemMain: {
    marginTop:10
  },
  images:{
    // flex: 1,
    width: 100,
    height: 100,
    marginTop:10,
    marginRight:10
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  brief: {
    color: '#8a8a8a'
  },
  button: {
    backgroundColor: '#333'
  },
  followButton: {
    padding: 7,
    borderColor: 'rgb(6, 181, 228)',
    borderWidth: 1,
    borderRadius: 5
  },
  gary: {
    borderColor: 'rgb(194, 194, 194)'
  },
  garyText: {
    color: 'rgb(194, 194, 194)'
  },
  followButtonText: {
    color: 'rgb(6, 181, 228)'
  }
})

export default connect((state, props) => ({
    topicList: getTopicListByName(state, props.id)
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch),
    followTopic: bindActionCreators(followTopic, dispatch),
    unfollowTopic: bindActionCreators(unfollowTopic, dispatch)
  })
)(TopicList)
