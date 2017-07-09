<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Useritem
 *
 * @ORM\Table(name="useritem", indexes={@ORM\Index(name="fk_user_item_User1_idx", columns={"id_user"}), @ORM\Index(name="fk_user_item_Item1_idx", columns={"id_listItem"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/useritems/' ~ object.getId())")
 */
class Useritem
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_useritem", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="current", type="string", length=100, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $current;

    /**
     * @var boolean
     *
     * @ORM\Column(name="seen", type="integer", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $seen;

    /**
     * @var string
     *
     * @ORM\Column(name="note", type="string", length=45, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $note;

    /**
     * @var \AppBundle\Entity\Listitem
     *
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Listitem")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_listItem", referencedColumnName="id_listItem", unique=true)
     * })
     *
     *
     */
    private $Listitem;

    /**
     * @var \Acme\ApiBundle\Entity\User
     *
     * @ORM\OneToOne(targetEntity="Acme\ApiBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_user", referencedColumnName="id", unique=true)
     * })
     *
     *
     */
    private $User;



    /**
     * Set idUseritem
     *
     * @param integer $idUseritem
     * @return Useritem
     */
    public function setIdUseritem($idUseritem)
    {
        $this->idUseritem = $idUseritem;

        return $this;
    }

    /**
     * Get idUseritem
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set current
     *
     * @param string $current
     * @return Useritem
     */
    public function setCurrent($current)
    {
        $this->current = $current;

        return $this;
    }

    /**
     * Get current
     *
     * @return string 
     */
    public function getCurrent()
    {
        return $this->current;
    }

    /**
     * Set seen
     *
     * @param boolean $seen
     * @return Useritem
     */
    public function setSeen($seen)
    {
        $this->seen = $seen;

        return $this;
    }

    /**
     * Get seen
     *
     * @return boolean 
     */
    public function getSeen()
    {
        return $this->seen;
    }

    /**
     * Set note
     *
     * @param string $note
     * @return Useritem
     */
    public function setNote($note)
    {
        $this->note = $note;

        return $this;
    }

    /**
     * Get note
     *
     * @return string
     */
    public function getNote()
    {
        return $this->note;
    }

    /**
     * Set idListitem
     *
     * @param \AppBundle\Entity\Listitem $idListitem
     * @return Useritem
     */
    public function setListitem(\AppBundle\Entity\Listitem $Listitem = null)
    {
        $this->Listitem = $Listitem;

        return $this;
    }

    /**
     * Get idListitem
     *
     * @return \AppBundle\Entity\Listitem 
     */
    public function getListitem()
    {
        return $this->Listitem;
    }

    /**
     * Set idUser
     *
     * @param \Acme\ApiBundle\Entity\User $idUser
     * @return Useritem
     */
    public function setUser(\Acme\ApiBundle\Entity\User $User = null)
    {
        $this->User = $User;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return \Acme\ApiBundle\Entity\User
     */
    public function getUser()
    {
        return $this->User;
    }

    /**
     * Get idUser
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdUser()
    {
        return null !== $this->User ? $this->User->getId() : null;
    }

    /**
     * Get idListitem
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdListitem()
    {
        return null !== $this->Listitem ? $this->Listitem->getId() : null;
    }
}
