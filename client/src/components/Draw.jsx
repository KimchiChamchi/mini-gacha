import React, { useState, useRef, useEffect } from "react";
// import "../styles/Candidate.css";

const Draw = (props) => {
  const { web3, drawContract, accounts, isLoading } = props.initialization;
  const [itemList, setItemList] = useState("");
  const [itemObtained, setItemObtained] = useState("");
  const [inventory, setInventory] = useState("");
  const [bonus, setBonus] = useState("");

  useEffect(async () => {
    if (drawContract == undefined) return;
    getInventory();
    getItemList();
    getBonus();
  }, [drawContract, itemObtained]);
  // 뽑기
  const draw = async (e) => {
    const minNum = 10 ** 14;
    const maxNum = minNum * 10 - 1;
    let randNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    await drawContract.methods
      .draw(randNum)
      .send({ from: accounts[0], value: web3.utils.toWei("1", "ether") })
      .then((result) => {
        setItemObtained(result.events.PickedItem.returnValues.pickedItem);
      })
      .catch((err) => console.log(err));
  };
  // 무료뽑기
  const freeDraw = async (e) => {
    const minNum = 10 ** 14;
    const maxNum = minNum * 10 - 1;
    let randNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    await drawContract.methods
      .freeDraw(randNum)
      .send({ from: accounts[0] })
      .then((result) => {
        setItemObtained(result.events.PickedItem.returnValues.pickedItem);
      })
      .catch((err) => console.log(err));
  };
  // 무료뽑기 스택 불러오기
  const getBonus = async (e) => {
    await drawContract.methods
      .getBonus()
      .call()
      .then((result) => {
        setBonus(result);
      });
  };
  // 내 인벤토리 불러오기
  const getInventory = async (e) => {
    console.log("인벤토리버튼");
    await drawContract.methods
      .getMyItemList()
      .call()
      .then((result) => {
        setInventory(result);
      });
  };
  // 아이템 목록 불러오기
  const getItemList = async (e) => {
    await drawContract.methods
      .getItems()
      .call()
      .then((result) => {
        setItemList(result);
      });
  };

  return (
    <div className="container">
      <div className="title">
        아차! 이곳은 가차없이 메챠쿠챠 당첨되는 가챠방
      </div>

      <div className="item_list_box">
        <div>등장 아이템</div>
        <br />
        <div>
          {itemList &&
            itemList.map((item, index) => {
              return <div key={index}>{item}</div>;
            })}
        </div>
      </div>

      <div className="draw_box">
        <div className="draw_result">
          {itemObtained ? (
            <>'{itemObtained}' 을(를) 획득하였습니다!!</>
          ) : (
            <>뽑기 대기중입니다.</>
          )}
        </div>
        {bonus == 5 ? (
          <button className="draw_button" onClick={freeDraw}>
            무료뽑기
          </button>
        ) : (
          <button className="draw_button" onClick={draw}>
            뽑기
          </button>
        )}
        <div>1회/1ETH</div>
        <div>5회 이용시 1회 무료뽑기 증정</div>
      </div>

      <div className="free_draw_box">
        <div>무료뽑기 획득</div>
        <div>({bonus}/5)</div>
      </div>

      <div className="inventory_box">
        <div>인벤토리</div>
        <br />
        <div className="inventory_space">
          {inventory &&
            inventory.map((item, index) => {
              return (
                <div key={index} className="my_item">
                  {item}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Draw;
